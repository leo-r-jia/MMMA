import uuid from "react-native-uuid";
import { API, Storage, Auth, graphqlOperation } from "aws-amplify";
import moment from "moment";
import * as FileSystem from "expo-file-system";

// CreateScanMutation for database query
const CreateScanMutation = `
mutation CreateScan($input: CreateScanInput!) {
  createScan(input: $input) {
    id
    date
    userID
  }
}`;

// Define internal directory for app
const imgDir = FileSystem.documentDirectory + "images";

// Ensure that a directory exists, create it if it doesn't
const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

// Function to retrieve the current authenticated user
export async function currentAuthenticatedUser() {
  try {
    // Get the current authenticated user using AWS Amplify Auth
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    throw error;
  }
}

// Function to get the URI of the last saved scan by its file ID
export const getLastScanUri = async (fileId) => {
  try {
    // Retrieve the scan file URI from storage using the provided file ID
    const file = await Storage.get(fileId, { level: "private" });
    return file;
  } catch (error) {
    console.error("Error getting last scan uri:", error);
  }
};

// Function to fetch scans associated with a specific user
export const fetchScansForUser = async (userId) => {
  // GraphQL query to list scans filtered by user ID
  const listScansQuery = `
        query ListScans {
            listScans(
                filter: { userID: { eq: "${userId}" } }
                ) {
                items {
                    id
                    date
                    userID
                    }
                }
            }
        `;

  try {
    // Execute the GraphQL query using AWS Amplify API
    const response = await API.graphql(graphqlOperation(listScansQuery));
    const scans = response.data.listScans.items;

    // Sort the scans by ID in ascending order
    scans.sort((a, b) => b.id.localeCompare(a.id));

    return scans;
  } catch (error) {
    throw error;
  }
};

// Save scan in internal directory
export const saveScan = async (scan) => {
  await ensureDirExists();
  // Create fileKey for the image
  const fileKey = `${moment().format()}${uuid.v4()}.jpg`;
  const dest = imgDir + fileKey;
  // Copy the image from cached memory to internal directory
  await FileSystem.copyAsync({ from: scan.assets[0].uri, to: dest });
  await uploadScan(fileKey, dest);
  return fileKey;
};

/**
 * Uploads an image to a private S3 bucket with retry logic to allow for S3 bucket initialisation for new users.
 *
 * @param {string} fileKey - The key or path under which the image will be stored in S3.
 * @param {string} imagUri - The URI of the image to upload.
 * @returns {Promise<void|null>} - A Promise that resolves when the upload is successful, or null if all retry attempts fail.
 */

const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY_MS = 1000; // Delay between retry attempts in milliseconds

const uploadScan = async (fileKey, imagUri) => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // Ensure user is authenticated so image will be uploaded to their private S3 bucket.
      await currentAuthenticatedUser();
      const response = await fetch(imagUri);
      const blob = await response.blob();
      // Upload image to private S3 bucket.
      await Storage.put(fileKey, blob, {
        level: "private",
        contentType: "image/jpeg",
      });
      break;
    } catch (error) {
      console.log(`Error uploading file (attempt ${attempt + 1}):`, error);
      if (attempt < MAX_RETRIES - 1) {
        // If there are more attempts remaining, wait for a while before retrying.
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        return null;
      }
    }
    attempt++;
  }
};

// Create the scan details in database
export const createScanInDatabase = async (fileKey, userId) => {
  try {
    // Create an object containing scan data
    const scanData = {
      id: fileKey,
      date: moment().format("Do MMM YYYY"),
      userID: userId,
    };
    // Use the GraphQL API to create a new scan record in the database
    await API.graphql({
      query: CreateScanMutation,
      variables: { input: scanData },
    });
    return true;
  } catch (error) {
    console.error("Error creating scan:", error);
    return false;
  }
};

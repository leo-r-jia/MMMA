import uuid from 'react-native-uuid';
import { API, Storage, Auth, graphqlOperation } from "aws-amplify";
import moment from 'moment';
import * as FileSystem from 'expo-file-system';

// CreateScanMutation for database query
const CreateScanMutation = `
mutation CreateScan($input: CreateScanInput!) {
  createScan(input: $input) {
    id
    date
    userID
  }
}`

// Define internal directory for app
const imgDir = FileSystem.documentDirectory + 'images';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
};

export async function currentAuthenticatedUser() {
    try {
        const user = await Auth.currentAuthenticatedUser();
        return user;
    } catch (error) {
        throw error;
    }
};

export const getLastScanUri = async (fileId) => {
    try {
        const file = await Storage.get(fileId, { level: 'private' });
        return file;
    } catch (error) {
        console.error('Error getting last scan uri:', error);
    }
}

export const fetchScansForUser = async (userId) => {
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
        const response = await API.graphql(graphqlOperation(listScansQuery));
        const scans = response.data.listScans.items;

        // Sort the scans by ID in ascending order
        scans.sort((a, b) => b.id.localeCompare(a.id));

        return scans;
    } catch (error) {
        throw error;
    }
}

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

// Upload scan to cloud storage
const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY_MS = 1000; // Delay between retry attempts in milliseconds

const uploadScan = async (fileKey, imagUri) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            await currentAuthenticatedUser();
            const response = await fetch(imagUri);
            const blob = await response.blob();
            // Upload image to private S3 bucket
            await Storage.put(fileKey, blob, {
                level: "private",
                contentType: "image/jpeg",
            });
            // If the upload is successful, break out of the loop
            break;
        } catch (error) {
            console.log(`Error uploading file (attempt ${attempt + 1}):`, error);
            if (attempt < MAX_RETRIES - 1) {
                // If there are more attempts remaining, wait for a while before retrying
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            } else {
                // If there are no more attempts remaining, return null
                return null;
            }
        }
        attempt++;
    }
};

// Create the scan details in database
export const createScanInDatabase = async (fileKey, userId) => {
    try {
        const scanData = {
            id: fileKey,
            date: moment().format('Do MMM YYYY'),
            userID: userId
        };
        await API.graphql({
            query: CreateScanMutation,
            variables: { input: scanData },
        });
        return true;
    } catch (error) {
        console.error('Error creating scan:', error);
        return false;
    }
};
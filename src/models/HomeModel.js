import uuid from 'react-native-uuid';
import { API, Storage, Auth } from "aws-amplify";
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

// User attributes
const [givenName, setGivenName] = useState();
const [userId, setuserId] = useState();

// Define internal directory for app
const imgDir = FileSystem.documentDirectory + 'images';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
};

// Get current authenticated user
useEffect(() => {
    currentAuthenticatedUser();
}, []);

async function currentAuthenticatedUser() {
    try {
        const user = await Auth.currentAuthenticatedUser();
        // Set userId and givenName of current authenticated user
        setuserId(user.attributes.sub);
        setGivenName(user.attributes.given_name);
    } catch (err) {
        console.log(err);
    }
};

// Fetch scans for user to populate dashboard
const fetchScansForUser = async (userId) => {
    try {
        return ScansData(userId);
    } catch (error) {
        console.error('Error fetching scans:', error);
        return [];
    }
};


async function fetchScansForUser(userId) {
    try {
        setScans(await ScansData(userId));
    } catch (error) {
        console.error('Error fetching scans:', error);
    }
}

useEffect(() => {
    fetchScansForUser(userId);
}, [userId]);

// Save scan in internal directory
const saveScan = async (scan) => {
    await ensureDirExists();
    // Create fileKey for the image
    const fileKey = `${moment().format()}${uuid.v4()}.jpg`;
    const dest = imgDir + fileKey;
    // Copy the image from cached memory to internal directory
    await FileSystem.copyAsync({ from: scan.assets[0].uri, to: dest });
    return { fileKey, dest };
};

// Upload scan to cloud storage
const uploadScan = async (fileKey, imagUri) => {
    try {
        const response = await fetch(imagUri);
        const blob = await response.blob();
        // Upload image to private S3 bucket
        await Storage.put(fileKey, blob, {
            level: "private",
            contentType: "image/jpeg",
        });
        return fileKey;
    } catch (error) {
        console.log("Error uploading file: ", error);
        return null;
    }
};

// Create the scan details in database
const createScanInDatabase = async (fileKey, userId) => {
    try {
        const scanData = {
            id: fileKey,
            date: moment().format('Do MMM YYYY'),
            userID: userId,
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

export {
    fetchScansForUser,
    saveScan,
    uploadScan,
    createScanInDatabase,
    givenName,
    userId
};

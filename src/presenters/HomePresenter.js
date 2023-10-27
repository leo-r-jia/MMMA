// HomePresenter.js
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import moment from "moment";
import {
  fetchScansForUser,
  currentAuthenticatedUser,
  saveScan,
  getLastScanUri,
  createScanInDatabase,
} from "../models/HomeModel";

function useHomePresenter(navigation) {
  const [givenName, setGivenName] = useState();
  const [userId, setUserId] = useState();
  const [scans, setScans] = useState([]);
  const [lastScanUri, setLastScanUri] = useState("");
  const [lastScanDate, setLastScanDate] = useState();

  // Get authenticated user data
  useEffect(() => {
    getCurrentAuthenticatedUserData();
  }, []);

  async function getCurrentAuthenticatedUserData() {
    try {
      const user = await currentAuthenticatedUser();
      if (user) {
        setUserId(user.attributes.sub);
        setGivenName(user.attributes.given_name);
      }
    } catch (error) {
      console.error("Get authenticated user data error: ", error);
    }
  }

  // Navigate to profile tab
  const onProfilePress = () => {
    navigation.navigate("ProfileScreen", { givenName });
  };

  // Fetch scans when user loads in
  useEffect(() => {
    fetchScans(userId);
  }, [userId]);

  async function fetchScans(userId) {
    try {
      // Calls fetchScansForUser from HomeModel
      setScans(await fetchScansForUser(userId));
    } catch (error) {
      console.error("Error fetching scans:", error);
    }
  }

  // Update last scan data when there are new scans
  useEffect(() => {
    if (scans.length > 0) {
      try {
        // Get and set the last scan uri
        getLastScanUri(scans[0].id).then(setLastScanUri);
      } catch (error) {
        console.error("Get last scan uri error: ", error);
      }
      // Get and set last scan date
      setLastScanDate(
        moment(scans[0].date, "Do MMM YYYY")
          .fromNow()
          .includes("hours", "seconds", "minutes")
          ? "Today"
          : moment(scans[0].date, "Do MMM YYYY").fromNow()
      );
    }
  }, [scans]);

  // Scan mole function
  async function scanMoles() {
    let result;

    try {
      // Request camera permissions using the ImagePicker library
      await ImagePicker.requestCameraPermissionsAsync();
      // Launch the camera and capture an image
      result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        quality: 0.1,
      });

      // If the user didn't cancel the image capture
      if (!result.canceled) {
        // Save the captured image and obtain a unique file key
        const fileKey = await saveScan(result);

        // Create a scan record in the database with the file key and user ID
        createScanInDatabase(fileKey, userId);
      }

      // Fetch and update the list of scans for the user
      fetchScans(userId);
    } catch (error) {
      // Handle erros related to uploading scan
      Alert.alert("Error Uploading Scan", error.message, "Try Again");
      console.log(error);
    }
  }

  return {
    onProfilePress,
    givenName,
    scans,
    lastScanDate,
    lastScanUri,
    scanMoles,
  };
}

export default useHomePresenter;

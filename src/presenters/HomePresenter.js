// HomePresenter.js
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import HomeScreen from './HomeScreen'; // Import the View
import { fetchScansForUser, saveScan, uploadScan, createScanInDatabase } from './Model';

function useHomePresenter({ navigation }) {
    const route = useRoute();
    const [givenName, setGivenName] = useState();
    const [userId, setuserId] = useState();
    const [scans, setScans] = useState([]);
    const [lastScanUri, setLastScanUri] = useState();
    const [lastScanDate, setLastScanDate] = useState();

    useEffect(() => {
        currentAuthenticatedUser();
    }, []);

    async function currentAuthenticatedUser() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            setuserId(user.attributes.sub);
            setGivenName(user.attributes.given_name);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchScansForUser(userId);
    }, [userId]);

    async function scanMoles() {
        let result;

        try {
            await ImagePicker.requestCameraPermissionsAsync();

            result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                quality: 0.1,
            })

            if (!result.canceled) {
                const { fileKey, dest } = await saveScan(result);
                if (fileKey) {
                    const uploadedFileKey = await uploadScan(fileKey, dest);
                    if (uploadedFileKey) {
                        createScanInDatabase(uploadedFileKey, userId);
                    }
                }
            }
        } catch (error) {
            Alert.alert("Error Uploading Scan", error.message, "Try Again")
            console.log(error);
        }
    }

    async function getLastScanUri(fileId) {
        Storage.get(fileId, { level: "private" }).then(setLastScanUri);
    }

    const onProfilePress = () => {
        navigate("ProfileScreen", { givenName });
    };

    useEffect(() => {
        if (scans.length > 0) {
            getLastScanUri(scans.at(0).id);
            setLastScanDate(moment(scans.at(0).date, "Do MMM YYYY").fromNow().includes('hours', 'seconds', 'minutes') ? 'Today' : moment(scans.at(0).date, "Do MMM YYYY").fromNow());
        }
    }, [scans]);

    return (
        <HomeScreen
            navigation={navigation}
            givenName={givenName}
            lastScanUri={lastScanUri}
            lastScanDate={lastScanDate}
            scans={scans}
            scanMoles={scanMoles}
            onProfilePress={onProfilePress}
        />
    );
}

export default useHomePresenter;

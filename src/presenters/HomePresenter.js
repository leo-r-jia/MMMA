// HomePresenter.js
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import moment from "moment";
import { fetchScansForUser, currentAuthenticatedUser, saveScan, getLastScanUri, createScanInDatabase } from '../models/HomeModel';

function useHomePresenter(navigation) {
    const [givenName, setGivenName] = useState();
    const [userId, setUserId] = useState();
    const [scans, setScans] = useState([]);
    const [lastScanUri, setLastScanUri] = useState('');
    const [lastScanDate, setLastScanDate] = useState();

    useEffect(() => {
        getCurrentAuthenticatedUserData();
    }, []);

    async function getCurrentAuthenticatedUserData() {
        try {
            const user = await currentAuthenticatedUser();
            setUserId(user.attributes.sub);
            setGivenName(user.attributes.given_name);
        }
        catch (error) {
            console.error("Get authenticated user data error: ", error)
        }
    }

    const onProfilePress = () => {
        navigation.navigate("ProfileScreen", { givenName });
    };

    useEffect(() => {
        fetchScans(userId);
    }, [userId]);

    useEffect(() => {
        if (scans.length > 0) {
            try {
                getLastScanUri(scans[0].id).then(setLastScanUri);
            } catch (error) {
                console.error("Get last scan uri error: ", error)
            }
            setLastScanDate(moment(scans[0].date, "Do MMM YYYY").fromNow().includes('hours', 'seconds', 'minutes') ? 'Today' : moment(scans[0].date, "Do MMM YYYY").fromNow());
        }
    }, [scans]);

    async function fetchScans(userId) {
        try {
            setScans(await fetchScansForUser(userId));
        } catch (error) {
            console.error('Error fetching scans:', error);
        }
    }

    async function scanMoles() {
        let result;

        try {
            await ImagePicker.requestCameraPermissionsAsync();

            result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                quality: 0.1,
            })

            if (!result.canceled) {
                const fileKey = await saveScan(result);
                createScanInDatabase(fileKey, userId);
            }

            fetchScans(userId);

        } catch (error) {
            Alert.alert("Error Uploading Scan", error.message, "Try Again")
            console.log(error);
        }
    }

    return {
        onProfilePress,
        givenName,
        scans,
        lastScanDate,
        lastScanUri,
        scanMoles
    }
}

export default useHomePresenter;

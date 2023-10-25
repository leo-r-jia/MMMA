import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, Alert, ImageBackground, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import uuid from 'react-native-uuid';
import { API, Storage, Auth } from "aws-amplify";
import Scans from "../components/Scans";
import moment from 'moment';
import ScansData from "../models/ScansData";
import * as FileSystem from 'expo-file-system';

const CreateScanMutation = `
mutation CreateScan($input: CreateScanInput!) {
  createScan(input: $input) {
    id
    date
    userID
  }
}`

const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
};

function HomeScreen({ navigation: { navigate } }) {
    const route = useRoute();
    const [givenName, setGivenName] = useState();
    const [userId, setuserId] = useState();

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

    const [scans, setScans] = useState([]);
    const [lastScanUri, setLastScanUri] = useState();
    const [lastScanDate, setLastScanDate] = useState();


    async function scanMoles() {
        let result;

        try {
            await ImagePicker.requestCameraPermissionsAsync();

            result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                quality: 0.1,
            })

            if (!result.canceled) {
                await saveScan(result);
            }

        } catch (error) {
            Alert.alert("Error Uploading Scan", error.message, "Try Again")
            console.log(error);
        }
    }

    async function saveScan(scan) {
        await ensureDirExists();

        const fileKey = `${moment().format()}${uuid.v4()}.jpg`;
        const dest = imgDir + fileKey;
        await FileSystem.copyAsync({ from: scan.assets[0].uri, to: dest });

        uploadScan(fileKey, dest);
    }

    async function uploadScan(fileKey, imagUri) {
        try {
            const response = await fetch(imagUri);
            const blob = await response.blob();
            await Storage.put(fileKey, blob, {
                level: "private",
                contentType: "image/jpeg",
            });
            createScanInDatabase(fileKey);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    async function createScanInDatabase(fileKey) {
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
            fetchScansForUser(userId);
        } catch (error) {
            console.error('Error creating scan:', error);
        }
    }

    async function getLastScanUri(fileId) {
        Storage.get(fileId, { level: "private" }).then(setLastScanUri);
    }

    const onProfilePress = () => {
        // console.log("PROFILE")
        navigate("ProfileScreen", { givenName });
    };

    useEffect(() => {
        if (scans.length > 0) {
            getLastScanUri(scans.at(0).id);
            setLastScanDate(moment(scans.at(0).date, "Do MMM YYYY").fromNow().includes('hours', 'seconds', 'minutes') ? 'Today' : moment(scans.at(0).date, "Do MMM YYYY").fromNow());
        }
    }, [scans]);


    return (
        <ImageBackground source={require('../../assets/backgrounds/HomeBg.png')} style={styles.imgBg} resizeMode="cover" >
            <SafeAreaView style={styles.wrapper}>

                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.subText}>Hi,</Text>
                            <Text style={styles.mainText}>{givenName}</Text>
                        </View>
                        <TouchableOpacity onPress={() => onProfilePress()}>
                            <Image
                                style={styles.profile}
                                source={require('../../assets/icons/user.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.middleContainer}>
                        <View style={styles.greyContainer}>
                            {scans.length > 0 ? (
                                <React.Fragment>
                                    <Text style={styles.subText}>Your last scan was:</Text>
                                    <Text style={styles.mainTextSm}>{lastScanDate}</Text>
                                    <View style={styles.whiteContainer}>
                                        <Image src={lastScanUri} style={styles.lastScanImage}></Image>
                                    </View>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Text style={styles.subText}>You have</Text>
                                    <Text style={styles.mainTextSm}>No Scans Yet</Text>
                                    <View style={styles.whiteContainerEmpty}>
                                        <CustomButton text="Add Your First Scan" onPress={scanMoles} />
                                    </View>
                                </React.Fragment>
                            )}
                        </View>
                    </View>
                    <View style={styles.scansContainer}>
                        <Scans scans={scans}></Scans>
                    </View>
                    <View style={styles.bottomContainer}>
                        <CustomButton text="New Scan" onPress={scanMoles} />
                    </View>
                </View>
            </SafeAreaView>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    imgBg: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        width: '100%',
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 2,
        width: '90%',
    },
    subText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#3a58e0',
        marginBottom: -5
    },
    mainText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#3a58e0',
    },
    mainTextSm: {
        fontSize: 30,
        fontWeight: '700',
        color: '#3a58e0',
        marginBottom: 5,
        textTransform: 'capitalize'
    },
    profile: {
        width: 55,
        height: 55,
    },
    middleContainer: {
        flex: 6,
        justifyContent: 'center',
        width: '90%',
    },
    greyContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: '10',
        padding: 12,
        height: 365,
    },
    lastScanImage: {
        height: 250,
        aspectRatio: 1,
        borderRadius: 3,
        resizeMode: 'stretch',
    },
    scansContainer: {
        padding: 0,
        margin: 0,
        paddingBottom: 15,
        flex: 3,
        width: '100%',
        justifyContent: 'flex-start'
    },
    whiteContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '5',
        height: 275,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteContainerEmpty: {
        backgroundColor: '#ffffff',
        borderRadius: '5',
        height: 275,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '15%',
        paddingVertical: '30%'
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        width: '90%',
    },
    smallButton: {
        width: '70%'
    }
})

export default HomeScreen;
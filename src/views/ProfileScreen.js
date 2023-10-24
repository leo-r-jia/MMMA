import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Button } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Auth } from 'aws-amplify';

function ProfileScreen({ navigation: { navigate }, route }) {

    const { givenName } = route.params;
    const back = "&lt;";

    const onLogoutPress = async () => {
        try {
            await Auth.signOut();
        }
        catch(error){
            console.error("Sign out error: ", error)
        }
        
        navigate('WelcomeScreen');
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.buttonContainer}><Button title="<" /></View>
                <View style={styles.profileContainer}>
                    <Image
                        style={styles.profile}
                        source={require('../../assets/icons/user.png')}
                    />
                    <Text style={styles.nameText}>{givenName}</Text>
                </View>
                <View style={styles.footerContainer}>
                    <CustomButton
                        text="Log Out"
                        onPress={onLogoutPress}
                        type="SECONDARY"
                        bdColor="#3a58e0"
                        fgColor="#3a58e0"
                    />
                </View>
            </View>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    wrapper: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%'
    },
    profile: {
        width: 100,
        height: 100,
    },
    nameText: {
        fontSize: 30,
        color: '#3a58e0',
        fontWeight: '700',
        paddingTop: 20
    },
    profileContainer: {
        flex: 4,
        paddingTop: 30,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '85%',
    },
    buttonContainer: {
        width: '100%'
    },
    footerContainer: {
        width: '85%',
        justifyContent: 'flex-end',
        gap: 0,
        flex: 3,
        paddingTop: 5
    }
});

export default ProfileScreen;

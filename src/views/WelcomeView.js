import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useWelcomePresenter } from '../presenters/WelcomePresenter';

// Welcome screen of the MMMA
function WelcomeView({ navigation }) {
    const {
        onSignInPress,
        onSignUpPress
    } = useWelcomePresenter(navigation);

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.headingContainer}>
                    <Text style={styles.heading}>MMMA</Text>
                    <Text style={styles.subHeading}>By Leo Jia</Text>
                </View>

                <View style={styles.footerContainer}>
                    <CustomButton
                        text="Sign In"
                        onPress={onSignInPress}
                        bgColor="white"
                        fgColor="#3a58e0"
                    />

                    <CustomButton
                        text="Sign Up"
                        onPress={onSignUpPress}
                        type="SECONDARY"
                        bdColor="white"
                        fgColor="white"
                    />

                </View>

            </View>
        </SafeAreaView >
    );
};

// Styles for components of the Welcome View
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3a58e0',
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#3a58e0',
        alignItems: 'center',
        width: '100%'
    },
    heading: {
        fontSize: 65,
        fontWeight: '700',
        color: 'white',
    },
    subHeading: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    text: {
        fontSize: 16,
        color: '#3a58e0',
        paddingTop: 20
    },
    headingContainer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '85%',
    },
    footerContainer: {
        width: '85%',
        alignItems: 'center',
        gap: 0,
        flex: 3,
        paddingTop: 5
    }
});

export default WelcomeView;

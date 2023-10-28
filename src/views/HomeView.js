//HomeView.js
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import CustomButton from "../components/CustomButton";
import Scans from "../components/Scans";
import useHomePresenter from "../presenters/HomePresenter";

function HomeScreen({ navigation }) {
  const {
    onProfilePress,
    givenName,
    scans,
    lastScanDate,
    lastScanUri,
    scanMoles,
  } = useHomePresenter(navigation);

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/HomeBg.png")}
      style={styles.imgBg}
      resizeMode="cover"
    >
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
                source={require("../../assets/icons/user.png")}
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
                    <Image
                      src={lastScanUri}
                      style={styles.lastScanImage}
                    ></Image>
                  </View>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Text style={styles.subText}>You have</Text>
                  <Text style={styles.mainTextSm}>No Scans Yet</Text>
                  <View style={styles.whiteContainerEmpty}>
                    <CustomButton
                      text="Add Your First Scan"
                      onPress={scanMoles}
                    />
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
    width: "100%",
    alignItems: "center",
  },
  imgBg: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
    width: "90%",
  },
  subText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#3a58e0",
    marginBottom: -5,
  },
  mainText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#3a58e0",
  },
  mainTextSm: {
    fontSize: 30,
    fontWeight: "700",
    color: "#3a58e0",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  profile: {
    width: 55,
    height: 55,
  },
  middleContainer: {
    flex: 6,
    justifyContent: "center",
    width: "90%",
  },
  greyContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    height: 365,
  },
  lastScanImage: {
    height: 250,
    aspectRatio: 1,
    borderRadius: 3,
    resizeMode: "stretch",
  },
  scansContainer: {
    padding: 0,
    margin: 0,
    paddingBottom: 15,
    flex: 3,
    width: "100%",
    justifyContent: "flex-start",
  },
  whiteContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    height: 275,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteContainerEmpty: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    height: 275,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "15%",
    paddingVertical: "30%",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    width: "90%",
  },
  smallButton: {
    width: "70%",
  },
});

export default HomeScreen;

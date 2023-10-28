import { View, Image, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Storage } from "aws-amplify";

const Scan = ({ scan }) => {
  const [imageUri, setImageUri] = useState();

  useEffect(() => {
    Storage.get(scan.id, { level: "private" }).then(setImageUri);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{scan.date}</Text>
      <Image src={imageUri} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    paddingTop: 7,
    width: 150,
    height: 175,
    marginLeft: 20,
    marginTop: 15,
  },
  dateText: {
    fontSize: 14,
    paddingBottom: 5,
    fontWeight: "500",
    color: "#3a58e0",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 5,
  },
});

export default Scan;

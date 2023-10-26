import { View, FlatList, StyleSheet, Text } from "react-native";
import Scan from "./Scan";
import React from "react";

const Scans = ({ scans }) => {
  const numberOfScans = scans.length;

  return (
    <View>
      <Text style={styles.pastScansText}>Past Scans ({numberOfScans})</Text>
      {numberOfScans > 0 ? (
        <React.Fragment>
          <FlatList
            data={scans}
            renderItem={({ item }) => <Scan scan={item} />}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </React.Fragment>
      ) : (
        <Text style={styles.noScansText}>Your scans will show up here</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pastScansText: {
    fontSize: 18,
    paddingLeft: "5%",
    fontWeight: "700",
    color: "#3a58e0",
  },
  noScansText: {
    fontSize: 16,
    marginTop: "20%",
    paddingLeft: "5%",
    fontWeight: "500",
    color: "grey",
  },
});

export default Scans;

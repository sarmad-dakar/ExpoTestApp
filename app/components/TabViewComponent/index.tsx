import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TabComponent = ({sports}) => {
  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["Tennis", "Squash", "Padel", "Cricket"];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {sports.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedTab(tab)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {selectedTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    // justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tabButton: {
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 20,
  },
  tabText: {
    color: "gray",
    fontSize: 16,
  },
  activeTabText: {
    color: "green",
  },
  activeTabIndicator: {
    marginTop: 4,
    height: 2,
    width: "100%",
    backgroundColor: "green",
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    padding: 20,
  },
});

export default TabComponent;

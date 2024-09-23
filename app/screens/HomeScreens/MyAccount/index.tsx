import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import SearchField from "@/app/components/SearchField";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import { colors } from "@/app/utils/theme";

const MyAccountScreen = () => {
  const subscriptions = [
    {
      heading: "date",
      values: ["Monday 19th july,2022", "Tuesday 20th july,2022"],
    },
    {
      heading: "Section",
      values: ["Tennis", "Squash"],
    },
    {
      heading: "Category",
      values: ["Others", "Single"],
    },
    {
      heading: "Invoice",
      values: ["Others", "Single"],
    },
  ];
  return (
    <View style={styles.container}>
      <GeneralHeader title="My Account" />
      <ScreenWrapper>
        <SearchField />
        <View style={styles.listContainer}>
          <ScrollView horizontal>
            {subscriptions.map((item, mainIndex) => {
              return (
                <View
                  style={[
                    styles.dateContainer,
                    { width: mainIndex == 0 ? 150 : 100 },
                  ]}
                >
                  <View
                    style={[
                      styles.dateContainer,
                      { width: mainIndex == 0 ? 151 : 100 },
                      {
                        backgroundColor: colors.primary,
                        height: 40,
                        paddingLeft: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text style={[styles.fontText, { color: "white" }]}>
                      {item.heading}
                    </Text>
                    <View
                      style={[styles.divider, { backgroundColor: "white" }]}
                    />
                  </View>
                  {item.values.map((item, index) => {
                    return (
                      <View
                        style={[
                          styles.dateContainer,
                          {
                            backgroundColor:
                              index % 2 !== 0 ? "white" : colors.lightShade,
                            height: 40,
                            width: mainIndex == 0 ? 150 : 100,
                            paddingLeft: 10,
                          },
                        ]}
                      >
                        <Text style={[styles.fontText, { color: "black" }]}>
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}

            {/* <View style={[styles.listBox, { backgroundColor: colors.primary }]}>
              <View style={styles.dateContainer}>
                <Text style={[styles.fontText, { color: "white" }]}>Date</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: "white" }]} />
              <View style={styles.section}>
                <Text style={[styles.fontText, { color: "white" }]}>
                  Section
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: "white" }]} />

              <View style={styles.category}>
                <Text style={[styles.fontText, { color: "white" }]}>
                  Category
                </Text>
              </View>
            </View> */}
          </ScrollView>
        </View>
        {/* <FlatList
              data={[1, 2, 3, 4, 5, 6, 7]}
              ListHeaderComponent={() => {
                return (
                  <View
                    style={[
                      styles.listBox,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <View style={styles.dateContainer}>
                      <Text style={[styles.fontText, { color: "white" }]}>
                        Date
                      </Text>
                    </View>
                    <View
                      style={[styles.divider, { backgroundColor: "white" }]}
                    />
                    <View style={styles.section}>
                      <Text style={[styles.fontText, { color: "white" }]}>
                        Section
                      </Text>
                    </View>
                    <View
                      style={[styles.divider, { backgroundColor: "white" }]}
                    />

                    <View style={styles.category}>
                      <Text style={[styles.fontText, { color: "white" }]}>
                        Category
                      </Text>
                    </View>
                  </View>
                );
              }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={[
                      styles.listBox,
                      {
                        backgroundColor:
                          index % 2 !== 0 ? "white" : colors.lightShade,
                      },
                    ]}
                  >
                    <View style={styles.dateContainer}>
                      <Text style={styles.fontText}>Monday,8th July 2024</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.section}>
                      <Text style={styles.fontText}>Tennis</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.category}>
                      <Text style={styles.fontText}>Others</Text>
                    </View>
                  </View>
                );
              }}
            /> */}
      </ScreenWrapper>
    </View>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateContainer: {
    // width: 130,
    justifyContent: "center",
    // height: 40,
    marginVertical: 1,
  },
  section: {
    width: 100,
    justifyContent: "center",
    height: 40,
  },
  category: {
    width: 100,
    justifyContent: "center",
    height: 40,
  },
  divider: {
    height: 10,
    width: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0005",
    marginRight: 10,
  },
  fontText: {
    fontSize: 12,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: "#0003",
  },
});

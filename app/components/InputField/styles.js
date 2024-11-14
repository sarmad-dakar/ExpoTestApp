import { vh } from "@/app/utils/units";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.7,
    height: 40,
    minWidth: "48%",
    marginVertical: 10,
    alignItems: "center",
    // paddingHorizontal: "1%",
    justifyContent: "space-between",
    flexDirection: "row",
    // borderRadius: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  input: {
    width: "80%",
    height: 50,
    // backgroundColor: "red",
    borderWidth: 0,
    alignSelf: "center",
  },
  rightContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    right: -3,
  },
  rightIcon: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -5,
    marginRight: 10,
    // alignSelf: "flex-start",
  },
  error: {
    color: "red",
  },
});

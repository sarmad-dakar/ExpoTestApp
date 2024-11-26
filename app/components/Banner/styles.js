import { Platform, StyleSheet } from "react-native";
import { vh } from "../../utils/units";
import { themeColors } from "../../utils/theme";

export const styles = StyleSheet.create({
  container: {
    height: "20%",
    backgroundColor: themeColors.primary,
    borderRadius: 16,
    justifyContent: "center",
    paddingLeft: "5%",
    overflow: "hidden",
  },
  ring1: {
    position: "absolute",
    right: -30,
    backgroundColor: "#323730",
    height: vh * 25,
    width: vh * 25,
    borderRadius: vh * 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  ring2: {
    backgroundColor: "#3a3f38",
    height: "80%",
    width: "80%",
    borderRadius: vh * 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ring3: {
    backgroundColor: "#4a4e48",
    height: "80%",
    width: "80%",
    borderRadius: vh * 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ring4: {
    backgroundColor: "white",
    height: "75%",
    width: "75%",
    borderRadius: vh * 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    // tintColor: "white",
  },
});

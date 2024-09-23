import { StyleSheet } from "react-native";
import { vh, vw } from "../../utils/units";

export const styles = StyleSheet.create({
  field: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    height: vh * 5.5,
  },
  h1: { fontSize: vh * 1.8, color: "black", textAlign: "center" },
  modal: {
    flex: 1,
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    backgroundColor: "white",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#00000024",

    paddingBottom: vh * 5,
  },
  innerContainer: {
    borderRadius: 20,
    height: vh * 90,
    backgroundColor: "white",
    width: "70%",
  },
});

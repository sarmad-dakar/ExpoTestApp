import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.7,
    height: 50,
    // minWidth: vw * 17,
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: "3%",
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  input: {
    width: "80%",
    height: "100%",
    alignSelf: "center",
  },
  rightContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  rightIcon: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  iconContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -5,
  },
  error: {
    color: "red",
  },
});

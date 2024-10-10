import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  RefObject,
  forwardRef,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import BerlingskeMedium from "../TextWrapper/BerlingskeMedium";
import SearchField from "@/app/components/SearchField";
import { colors } from "@/app/utils/theme";
import { icons } from "@/app/MyAssets";
import { dummyPlayers } from "@/app/utils/dummyJson";
import MainButton from "../MainButton";

// Get screen dimensions
const { height } = Dimensions.get("window");

interface Player {
  gender: string;
  name: string;
  memberCode: string;
  isFavourite: boolean;
}

export type addplayerPopupRef = {
  show: () => void;
  hide: () => void;
};

type addplayerPopupProps = {
  setSelectedPlayers: Dispatch<SetStateAction<Player[]>>;
  selectedPlayers: Player[];
  reference?: RefObject<addplayerPopupRef>; // Optional if passing forwardRef
  allPlayers: Player[];
  maximumPlayers: number;
};

const AddPlayerModal = forwardRef<addplayerPopupRef, addplayerPopupProps>(
  (props, ref) => {
    const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
    const [visible, setVisible] = useState(false);
    const tabs = ["Favourites", "All Members"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    useImperativeHandle(props?.reference, () => ({
      hide: hide,
      show: show,
    }));

    const hide = () => {
      setVisible(false);
      props.setSelectedPlayers(props.selectedPlayers);
    };

    const show = () => {
      setVisible(true);
    };

    useEffect(() => {
      if (visible) {
        slideUp();
      } else {
        slideDown();
      }
    }, [visible]);

    // Slide-up animation
    const slideUp = () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    // Slide-down animation
    const slideDown = () => {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false)); // Call onClose after animation
    };

    const handleSelection = (player: Player) => {
      const alreadyAdded = props.selectedPlayers.find(
        (item) => item.memberCode == player.memberCode
      );
      if (!alreadyAdded) {
        if (props.maximumPlayers !== props.selectedPlayers.length) {
          props.setSelectedPlayers([...props.selectedPlayers, player]);
        }
      } else {
        const removePlayer = props.selectedPlayers.filter(
          (item) => item.memberCode !== player.memberCode
        );
        props.setSelectedPlayers(removePlayer);
      }
    };
    const handleCheckIsExist = (player: Player) => {
      const isExist = props.selectedPlayers.find(
        (item) => item.memberCode == player.memberCode
      );
      if (isExist) {
        return true;
      } else {
        return false;
      }
    };

    return (
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={slideDown}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={slideDown}
        />
        <Animated.View
          style={[
            styles.bottomSheet,
            { transform: [{ translateY }] }, // Animated slide-up
          ]}
        >
          {/* Bottom sheet content */}
          <View style={styles.content}>
            <BerlingskeBold style={{ marginBottom: 10 }}>
              Add Players
            </BerlingskeBold>
            <View style={styles.headingContainer}>
              {tabs.map((item) => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setSelectedTab(item)}
                >
                  <Text
                    style={[
                      styles.heading,
                      selectedTab == item && {
                        color: colors.green,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <SearchField />
            <View style={styles.listContainer}>
              <View style={{ flex: 1 }}>
                <FlatList
                  data={props.allPlayers}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={[
                          styles.listTile,
                          {
                            backgroundColor:
                              index % 2 !== 0 ? "white" : colors.lightShade,
                          },
                        ]}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <TouchableOpacity
                            onPress={() => handleSelection(item)}
                            style={styles.checkbox}
                          >
                            {handleCheckIsExist(item) && (
                              <Image
                                source={icons.tick}
                                style={{
                                  width: "60%",
                                  height: "60%",
                                  resizeMode: "contain",
                                }}
                              />
                            )}
                          </TouchableOpacity>
                          <View style={styles.divider} />
                          <Text style={styles.playerName}>
                            {item.name} ({item.score})
                          </Text>
                        </View>
                        {item?.isFav ? (
                          <Image
                            source={icons.starFilled}
                            style={styles.icon}
                          />
                        ) : (
                          <Image
                            source={icons.starUnfilled}
                            style={styles.icon}
                          />
                        )}
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            <MainButton title="Done" onPress={hide} />
          </View>
        </Animated.View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "flex-end",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: height * 0.9, // Adjust height as needed
  },
  content: {
    // alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  headingContainer: {
    flexDirection: "row",
  },
  heading: {
    color: "#5F5F5F",
    marginRight: 10,
    fontSize: 16,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: "#0002",
    marginTop: 10,
    flex: 1,
  },
  listTile: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
  },
  checkbox: {
    height: 17,
    width: 17,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 13,
    width: 1,
    backgroundColor: "#0008",
    marginHorizontal: 10,
  },
  playerName: {
    fontSize: 13,
    color: "#3B5049",
  },
  icon: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
});

export default AddPlayerModal;

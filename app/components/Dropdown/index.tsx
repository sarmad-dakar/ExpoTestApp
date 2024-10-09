import { View, Modal, FlatList, TouchableOpacity, Text } from "react-native";
import React, {
  useState,
  useImperativeHandle,
  RefObject,
  forwardRef,
} from "react";
import Animated, { SlideInDown } from "react-native-reanimated";
import { styles } from "./styles";
import { colors } from "../../utils/theme";
import { vh } from "@/app/utils/units";

export type SelectDropdownRef = {
  show: () => void;
  hide: () => void;
};

type selectDropdownProp = {
  onChangeValue?: (value: DropdownItem) => void;
  reference?: RefObject<SelectDropdownRef>; // Optional if passing forwardRef
  values: DropdownItem[];
};

// Define the type for the individual items in the dropdown
type DropdownItem = {
  label?: string;
  value?: string;
  title?: string;
  key?: string;
};

const SelectDropDown = forwardRef<SelectDropdownRef, selectDropdownProp>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);

    useImperativeHandle(ref || props.reference, () => ({
      hide: hide,
      show: show,
    }));

    const hide = () => {
      setVisible(false);
    };
    const show = () => {
      setVisible(true);
    };
    const getHeight = () => {
      if (props?.values?.length > 18) {
        return vh * 90;
      }
      if (props?.values?.length > 5) {
        return vh * 50;
      }
    };

    const renderItem = ({
      item,
      index,
    }: {
      item: DropdownItem;
      index: number;
    }) => {
      return (
        <Animated.View
          entering={SlideInDown.duration((index + 1) * 50)}
          style={styles.field}
        >
          <TouchableOpacity
            style={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: "4%",
            }}
            onPress={() => {
              setVisible(false);
              if (props.onChangeValue) {
                props?.onChangeValue(item);
              }
            }}
          >
            <Text style={styles.h1}>{item.label || item.title}</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    };
    return (
      <Modal
        transparent={true}
        statusBarTranslucent={true}
        visible={visible}
        supportedOrientations={[
          "landscape",
          "landscape-left",
          "landscape-right",
        ]}
        onRequestClose={() => setVisible(false)}
        style={styles.modal}
      >
        <View style={styles.mainContainer}>
          <View style={[styles.innerContainer, { height: getHeight() }]}>
            <FlatList
              data={props.values}
              showsVerticalScrollIndicator={false}
              renderItem={(item) => renderItem(item)}
              horizontal={false}
            />
            <View style={[styles.field, { backgroundColor: colors.primary }]}>
              <TouchableOpacity
                style={{
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: "4%",
                }}
                onPress={() => {
                  setVisible(false);
                }}
              >
                <Text style={[styles.h1, { color: "white" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
export default SelectDropDown;

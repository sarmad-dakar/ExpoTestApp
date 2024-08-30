import { vh } from "@/app/utils/units";
import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface SlidingDrawerProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
}

const SlidingDrawer: React.FC<SlidingDrawerProps> = ({
  children,
  isVisible,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const openDrawer = () => {
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      onClose();
    });
  };
  useEffect(() => {
    if (isVisible && !isOpen) {
      openDrawer();
    } else if (!isVisible && isOpen) {
      closeDrawer();
    }
  }, [isVisible]);

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
    >
      <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,
    height: vh * 100,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#f00",
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default SlidingDrawer;

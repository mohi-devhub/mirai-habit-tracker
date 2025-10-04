import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { MascotMessage } from "@/types";

interface MascotModalProps {
  message: MascotMessage;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

export const MascotModal: React.FC<MascotModalProps> = ({
  message,
  onClose,
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [scaleValue]);

  const handleClose = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const getBackgroundColor = () => {
    switch (message.type) {
      case "celebration":
        return "#10b981"; // Green
      case "encouragement":
        return "#3b82f6"; // Blue
      case "reminder":
        return "#f59e0b"; // Orange
      case "adjustment":
        return "#8b5cf6"; // Purple
      default:
        return "#6366f1"; // Indigo
    }
  };

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: getBackgroundColor(),
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <View style={styles.content}>
            <Text style={styles.emoji}>{message.emoji}</Text>
            <Text style={styles.title}>{message.title}</Text>
            <Text style={styles.message}>{message.message}</Text>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

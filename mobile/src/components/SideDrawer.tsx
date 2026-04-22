import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Dimensions, Modal, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants";
import { useAuth } from "../context/AuthContext";
import { saveRemlyContact } from "../utils/contacts";
import AnimatedPressable from "./AnimatedPressable";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tint?: string;
  iconBg?: string;
}

function MenuItem({ icon, label, onPress, tint, iconBg }: MenuItemProps) {
  const textColor = tint ?? COLORS.textPrimary;
  const bgColor = iconBg ?? COLORS.brandLight;
  const iconColor = tint ?? COLORS.brand;
  return (
    <AnimatedPressable onPress={onPress} scaleValue={0.96}>
      <View className="flex-row items-center gap-3 px-4 py-3 bg-white rounded-2xl">
        <View
          className="rounded-xl p-2.5"
          style={{ backgroundColor: bgColor }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text
          className="flex-1 text-[15px] font-semibold"
          style={{ color: textColor }}
        >
          {label}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
      </View>
    </AnimatedPressable>
  );
}

export default function SideDrawer({ visible, onClose }: SideDrawerProps) {
  const { user, logout } = useAuth();
  const translateX = useSharedValue(DRAWER_WIDTH);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(0, { duration: 260 });
      backdropOpacity.value = withTiming(1, { duration: 260 });
    } else {
      translateX.value = withTiming(DRAWER_WIDTH, { duration: 220 });
      backdropOpacity.value = withTiming(0, { duration: 220 });
    }
  }, [visible, translateX, backdropOpacity]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleSaveContact = async () => {
    try {
      const saved = await saveRemlyContact();
      if (saved) {
        Alert.alert(
          "Done",
          "Remly AI Assistant has been saved to your contacts. Calls won't be blocked as spam."
        );
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    onClose();
  };

  const handleNavigate = (path: "/about" | "/legal" | "/privacy" | "/ai-usage") => {
    onClose();
    setTimeout(() => {
      router.push(path);
    }, 220);
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          onClose();
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1">
        <Animated.View
          style={[{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }, backdropStyle]}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: DRAWER_WIDTH,
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 28,
              borderBottomLeftRadius: 28,
              shadowColor: "#000",
              shadowOffset: { width: -4, height: 0 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 16,
            },
            drawerStyle,
          ]}
        >
          <View className="flex-1 pt-14 pb-6">
            <View className="px-5 pb-5 border-b border-gray-100">
              <View className="flex-row items-center gap-3">
                <View
                  className="rounded-full p-4"
                  style={{ backgroundColor: COLORS.brand }}
                >
                  <Ionicons name="person" size={26} color={COLORS.white} />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[15px] font-bold text-gray-900"
                    numberOfLines={1}
                  >
                    {user?.phone_number ?? "Not signed in"}
                  </Text>
                  <Text
                    className="text-xs text-gray-500 mt-0.5"
                    numberOfLines={1}
                  >
                    {user?.country?.flag ?? ""} {user?.country?.name ?? user?.timezone ?? ""}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-1 px-3 pt-4 gap-2">
              <MenuItem
                icon="person-add-outline"
                label="Save to Contacts"
                onPress={handleSaveContact}
              />
              <MenuItem
                icon="information-circle-outline"
                label="About Us"
                onPress={() => handleNavigate("/about")}
              />
              <MenuItem
                icon="shield-outline"
                label="Legal & Trademarks"
                onPress={() => handleNavigate("/legal")}
              />
              <MenuItem
                icon="lock-closed-outline"
                label="Privacy Policy"
                onPress={() => handleNavigate("/privacy")}
              />
              <MenuItem
                icon="sparkles-outline"
                label="AI Usage"
                onPress={() => handleNavigate("/ai-usage")}
              />
            </View>

            <View className="px-3 pt-3 border-t border-gray-100">
              <MenuItem
                icon="log-out-outline"
                label="Sign Out"
                onPress={handleLogout}
                tint={COLORS.red}
                iconBg="#fef2f2"
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

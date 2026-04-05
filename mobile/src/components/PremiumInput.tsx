import React, { useState } from "react";
import { TextInput, type TextInputProps } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "../constants";

interface PremiumInputProps extends TextInputProps {
  index?: number;
}

export default function PremiumInput({ index = 0, style, ...props }: PremiumInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 80).duration(500).springify()}>
      <TextInput
        className={`rounded-2xl px-5 py-4 text-base bg-gray-50 ${
          focused ? "border-2 border-brand" : "border border-gray-200"
        }`}
        placeholderTextColor={COLORS.placeholder}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[
          focused && {
            shadowColor: COLORS.brand,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 4,
          },
          style,
        ]}
        {...props}
      />
    </Animated.View>
  );
}

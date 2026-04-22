import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ReliabilityRingProps {
  percentage: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

function getColor(pct: number): string {
  if (pct >= 90) return "#059669";
  if (pct >= 70) return "#10b981";
  if (pct >= 50) return "#f59e0b";
  if (pct > 0) return "#ef4444";
  return "#d1d5db";
}

export default function ReliabilityRing({
  percentage,
  label,
  size = 150,
  strokeWidth = 14,
}: ReliabilityRingProps) {
  const color = getColor(percentage);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: size * 0.26,
            fontWeight: "800",
            color: "#111827",
            letterSpacing: -1,
          }}
        >
          {percentage}%
        </Text>
        <Text
          style={{
            fontSize: size * 0.08,
            fontWeight: "800",
            color,
            marginTop: 2,
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

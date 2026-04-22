import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants";
import type { WeeklyBar } from "../utils/profileStats";

interface WeeklyBarChartProps {
  data: WeeklyBar[];
}

interface BarProps {
  bar: WeeklyBar;
  maxCount: number;
  index: number;
}

function Bar({ bar, maxCount, index }: BarProps) {
  const heightValue = useSharedValue(0);
  const targetRatio = maxCount === 0 ? 0 : bar.count / maxCount;

  useEffect(() => {
    heightValue.value = withDelay(
      index * 60,
      withTiming(targetRatio, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
  }, [targetRatio, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${Math.max(heightValue.value * 100, 4)}%`,
  }));

  const barColor = bar.isToday ? COLORS.brand : bar.count > 0 ? "#c7d2fe" : "#e5e7eb";

  return (
    <View className="items-center gap-2 flex-1">
      <View className="flex-1 w-full items-center justify-end">
        <Animated.View
          style={[
            {
              width: "70%",
              backgroundColor: barColor,
              borderRadius: 8,
              minHeight: 6,
            },
            animatedStyle,
          ]}
        />
      </View>
      <Text
        className={`text-[10px] font-bold ${bar.isToday ? "text-brand" : "text-gray-400"}`}
      >
        {bar.shortDay}
      </Text>
      {bar.count > 0 && (
        <Text
          className={`text-[10px] font-semibold ${bar.isToday ? "text-brand" : "text-gray-500"}`}
          style={{ position: "absolute", top: -14 }}
        >
          {bar.count}
        </Text>
      )}
    </View>
  );
}

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <View
      className="bg-white rounded-2xl p-5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View className="flex-row items-end justify-between mb-2" style={{ height: 120 }}>
        {data.map((bar, i) => (
          <Bar key={i} bar={bar} maxCount={maxCount} index={i} />
        ))}
      </View>
    </View>
  );
}

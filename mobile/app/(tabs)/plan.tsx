import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as api from "../../src/api/client";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import RazorpayCheckout from "../../src/components/RazorpayCheckout";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import type { CreditPlan, RazorpayOrder } from "../../src/types";

const PLAN_ICONS: Record<string, string> = {
  starter: "flash-outline",
  pro: "diamond-outline",
  topup: "wallet-outline",
};

const PLAN_BADGE: Record<string, string | null> = {
  starter: null,
  pro: "Best Value",
  topup: null,
};

export default function PlanScreen() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<RazorpayOrder | null>(null);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getPlans();
        setPlans(data);
      } catch (e: any) {
        Alert.alert("Error", e.message);
      } finally {
        setLoadingPlans(false);
      }
    })();
  }, []);

  const handlePurchase = async (plan: CreditPlan) => {
    setProcessingPlan(plan.id);
    try {
      const order = await api.createOrder(plan.id);
      setCheckoutData(order);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handlePaymentSuccess = async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setCheckoutData(null);
    try {
      const result = await api.verifyPayment(
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature
      );
      await refreshUser();
      Alert.alert(
        "Payment Successful",
        `${result.credits_added} credits added. You now have ${result.total_credits} credits.`,
        [{ text: "OK" }]
      );
    } catch (e: any) {
      Alert.alert("Verification Failed", e.message);
    }
  };

  if (loadingPlans) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Animated.View entering={FadeIn.duration(500)}>
          <LinearGradient
            colors={[COLORS.brand, COLORS.brandDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 items-center"
            style={{
              shadowColor: COLORS.brand,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">Your Balance</Text>
            <Animated.Text
              className="text-white text-5xl font-extrabold mt-2"
              style={pulseStyle}
            >
              {user?.credits ?? 0}
            </Animated.Text>
            <Text className="text-indigo-200 text-sm mt-1">credits remaining</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200).duration(400)} className="mt-8 mb-4">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Choose a Plan
          </Text>
        </Animated.View>

        {plans.map((plan, index) => {
          const iconName = PLAN_ICONS[plan.id] ?? "card-outline";
          const badge = PLAN_BADGE[plan.id];
          const isProcessing = processingPlan === plan.id;

          return (
            <Animated.View
              key={plan.id}
              entering={FadeInDown.delay(300 + index * 100).duration(500).springify()}
            >
              <AnimatedPressable
                onPress={() => handlePurchase(plan)}
                disabled={isProcessing}
                scaleValue={0.98}
              >
                <View
                  className={`bg-white rounded-2xl p-5 mb-3 flex-row items-center gap-4 ${
                    badge ? "border-2 border-brand" : "border border-gray-100"
                  }`}
                  style={{
                    shadowColor: badge ? COLORS.brand : "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: badge ? 0.12 : 0.05,
                    shadowRadius: 12,
                    elevation: badge ? 5 : 3,
                  }}
                >
                  <LinearGradient
                    colors={badge ? [COLORS.brand, COLORS.brandDark] : [COLORS.brandLight, "#f0edff"]}
                    className="rounded-xl p-3"
                  >
                    <Ionicons
                      name={iconName as any}
                      size={24}
                      color={badge ? COLORS.white : COLORS.brand}
                    />
                  </LinearGradient>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-bold text-gray-900">{plan.name}</Text>
                      {badge && (
                        <View className="bg-brand px-2 py-0.5 rounded-full">
                          <Text className="text-white text-xs font-bold">{badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-gray-400 mt-0.5">{plan.credits} call credits</Text>
                  </View>

                  <View className="items-end">
                    {isProcessing ? (
                      <ActivityIndicator size="small" color={COLORS.brand} />
                    ) : (
                      <Text className="text-lg font-extrabold text-brand">{plan.display_price}</Text>
                    )}
                  </View>
                </View>
              </AnimatedPressable>
            </Animated.View>
          );
        })}

        <Animated.View entering={FadeIn.delay(600).duration(400)} className="mt-6 items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.textTertiary} />
            <Text className="text-xs text-gray-400">Secured by Razorpay</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {checkoutData && (
        <RazorpayCheckout
          visible
          keyId={checkoutData.key_id}
          orderId={checkoutData.order_id}
          amount={checkoutData.amount}
          currency={checkoutData.currency}
          planName={checkoutData.plan.name}
          userPhone={user?.phone_number ?? ""}
          onSuccess={handlePaymentSuccess}
          onDismiss={() => setCheckoutData(null)}
        />
      )}
    </View>
  );
}

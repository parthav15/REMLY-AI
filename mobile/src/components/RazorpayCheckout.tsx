import React from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { COLORS } from "../constants";

interface RazorpayCheckoutProps {
  visible: boolean;
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  planName: string;
  userPhone: string;
  onSuccess: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onDismiss: () => void;
}

export default function RazorpayCheckout({
  visible,
  keyId,
  orderId,
  amount,
  currency,
  planName,
  userPhone,
  onSuccess,
  onDismiss,
}: RazorpayCheckoutProps) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; font-family: -apple-system, sans-serif; }
    .loading { text-align: center; color: #6b7280; }
    .loading p { margin-top: 16px; font-size: 15px; }
  </style>
</head>
<body>
  <div class="loading">
    <p>Opening payment...</p>
  </div>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    var options = {
      key: "${keyId}",
      amount: ${amount},
      currency: "${currency}",
      name: "Remly AI",
      description: "${planName}",
      order_id: "${orderId}",
      prefill: { contact: "${userPhone}" },
      theme: { color: "#4f46e5" },
      handler: function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "success",
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }));
      },
      modal: {
        ondismiss: function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "dismissed" }));
        }
      }
    };
    var rzp = new Razorpay(options);
    rzp.on("payment.failed", function(response) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "failed",
        error: response.error.description
      }));
    });
    rzp.open();
  </script>
</body>
</html>`;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "success") {
        onSuccess({
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
        });
      } else {
        onDismiss();
      }
    } catch {
      onDismiss();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-5 pt-5 pb-3 bg-white border-b border-gray-100">
          <Text className="text-lg font-bold text-gray-900">Complete Payment</Text>
          <Pressable onPress={onDismiss} className="bg-gray-100 rounded-full px-4 py-2">
            <Text className="text-sm font-semibold text-gray-500">Cancel</Text>
          </Pressable>
        </View>
        <WebView
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          startInLoadingState
          renderLoading={() => (
            <View className="flex-1 items-center justify-center absolute inset-0 bg-gray-50">
              <ActivityIndicator size="large" color={COLORS.brand} />
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

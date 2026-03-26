import { colors } from "@/src/lib/theme";
import { useEffect } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SkeletonProps = {
  width: ViewStyle["width"];
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        skeletonStyles.base,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonGroup({ children }: { children: React.ReactNode }) {
  return <View style={skeletonStyles.group}>{children}</View>;
}

const skeletonStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.border,
  },
  group: {
    gap: 12,
  },
});

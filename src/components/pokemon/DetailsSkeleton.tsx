import { Skeleton } from "@/src/components/Skeleton";
import { colors } from "@/src/lib/theme";
import { ScrollView, StyleSheet, View } from "react-native";

export function DetailsSkeleton() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Hero skeleton */}
      <View style={[styles.hero, { backgroundColor: colors.border }]}>
        <View style={styles.heroTopRow}>
          <Skeleton width={60} height={16} borderRadius={4} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <Skeleton
          width={180}
          height={180}
          borderRadius={90}
          style={{ alignSelf: "center", marginVertical: 8 }}
        />
        <Skeleton
          width={140}
          height={28}
          borderRadius={8}
          style={{ alignSelf: "center", marginTop: 4 }}
        />
        <View style={[styles.typesRow, { alignSelf: "center" }]}>
          <Skeleton width={80} height={28} borderRadius={20} />
          <Skeleton width={80} height={28} borderRadius={20} />
        </View>
      </View>

      {/* About skeleton */}
      <View style={styles.section}>
        <Skeleton width={80} height={20} borderRadius={6} />
        <View style={[styles.infoRow, { marginTop: 12 }]}>
          <View style={styles.infoItem}>
            <Skeleton width={50} height={18} borderRadius={4} />
            <Skeleton width={40} height={12} borderRadius={4} />
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Skeleton width={50} height={18} borderRadius={4} />
            <Skeleton width={40} height={12} borderRadius={4} />
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Skeleton width={50} height={18} borderRadius={4} />
            <Skeleton width={40} height={12} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* Abilities skeleton */}
      <View style={styles.section}>
        <Skeleton width={100} height={20} borderRadius={6} />
        <View style={[styles.abilitiesRow, { marginTop: 12 }]}>
          <Skeleton width={100} height={38} borderRadius={12} />
          <Skeleton width={120} height={38} borderRadius={12} />
        </View>
      </View>

      {/* Stats skeleton */}
      <View style={styles.section}>
        <Skeleton width={110} height={20} borderRadius={6} />
        <View style={[styles.statsContainer, { marginTop: 12 }]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.statRow}>
              <Skeleton width={36} height={12} borderRadius={4} />
              <Skeleton width={32} height={12} borderRadius={4} />
              <Skeleton width="60%" height={6} borderRadius={3} />
            </View>
          ))}
        </View>
      </View>

      {/* Button skeleton */}
      <Skeleton
        width="auto"
        height={48}
        borderRadius={16}
        style={{ marginTop: 20, marginHorizontal: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  hero: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderCurve: "continuous",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderCurve: "continuous",
    paddingVertical: 16,
    boxShadow: `0 2px 8px ${colors.shadow}`,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  infoDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  abilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statsContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderCurve: "continuous",
    padding: 16,
    gap: 10,
    boxShadow: `0 2px 8px ${colors.shadow}`,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

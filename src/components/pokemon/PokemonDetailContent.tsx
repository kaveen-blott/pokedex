import { useFavorites } from "@/src/lib/favorites";
import {
  fetchPokemonDetails,
  getPokemonArtworkUrl,
  TYPE_COLORS,
} from "@/src/lib/pokeapi";
import { formatPokemonName } from "@/src/lib/pokemon-name";
import { colors } from "@/src/lib/theme";
import type { PokemonDetails } from "@/src/types/pokemon";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  ZoomIn,
} from "react-native-reanimated";

import { DetailsSkeleton } from "./DetailsSkeleton";
import { InfoCard } from "./InfoCard";
import { STAT_LABELS, StatBar } from "./StatBar";
import { TypeBadge } from "./TypeBadge";

function formatHeight(dm: number): string {
  const m = dm / 10;
  return `${m.toFixed(1)} m`;
}

function formatWeight(hg: number): string {
  const kg = hg / 10;
  return `${kg.toFixed(1)} kg`;
}

interface PokemonDetailContentProps {
  id: string;
  onTitleResolved?: (title: string) => void;
  onExploreMoreStats?: (id: string) => void;
}

export function PokemonDetailContent({
  id,
  onTitleResolved,
  onExploreMoreStats,
}: PokemonDetailContentProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canonicalId = pokemon ? String(pokemon.id) : id;
  const favorited = isFavorite(canonicalId);

  const loadDetails = useCallback(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid Pokemon id.");
      return;
    }
    setLoading(true);
    setError(null);
    fetchPokemonDetails(id)
      .then((data) => {
        setPokemon(data);
        onTitleResolved?.(formatPokemonName(data.name));
      })
      .catch(() => setError("Failed to load Pokemon details."))
      .finally(() => setLoading(false));
  }, [id, onTitleResolved]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroBackgroundStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.3, 1],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, 200],
      [-50, 0, 0],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }, { translateY }] };
  });

  const heroImageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, 60],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [-80, 0, 200],
      [1.15, 1, 0.85],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 180],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }, { scale }], opacity };
  });

  const heroTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 150],
      [0, 30],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 120],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }], opacity };
  });

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Something went wrong."}</Text>
        <Pressable style={styles.retryButton} onPress={loadDetails}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const heroBg = TYPE_COLORS[primaryType] ?? colors.red;
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <Animated.ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 0 }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      {/* Hero Section */}
      <Animated.View
        style={[styles.hero, { backgroundColor: heroBg }, heroBackgroundStyle]}
      >
        <View style={styles.heroTopRow}>
          <Text style={styles.heroId}>
            #{String(pokemon.id).padStart(3, "0")}
          </Text>
          <Pressable
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(canonicalId)}
            hitSlop={12}
            accessible
            accessibilityRole="button"
            accessibilityLabel={
              favorited ? "Remove from favorites" : "Add to favorites"
            }
            accessibilityState={{ selected: favorited }}
            accessibilityHint={
              favorited
                ? "Removes this Pokemon from your favorites"
                : "Adds this Pokemon to your favorites"
            }
          >
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={26}
              color="#fff"
            />
          </Pressable>
        </View>
        <Animated.View
          entering={ZoomIn.delay(100).duration(500)}
          style={heroImageStyle}
        >
          <Image
            source={{ uri: getPokemonArtworkUrl(String(pokemon.id)) }}
            style={styles.heroSprite}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </Animated.View>
        <Animated.Text
          entering={FadeInUp.delay(250).duration(400)}
          style={[styles.heroName, heroTextStyle]}
        >
          {formatPokemonName(pokemon.name)}
        </Animated.Text>
        <Animated.View
          entering={FadeInUp.delay(350).duration(350)}
          style={[styles.typesRow, heroTextStyle]}
        >
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} name={t.type.name} />
          ))}
        </Animated.View>
      </Animated.View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        {/* About Section */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: heroBg }]}>About</Text>
          <View style={styles.infoRow}>
            <InfoCard label="Height" value={formatHeight(pokemon.height)} />
            <View style={styles.infoDivider} />
            <InfoCard label="Weight" value={formatWeight(pokemon.weight)} />
            <View style={styles.infoDivider} />
            <InfoCard
              label="Base Exp"
              value={String(pokemon.base_experience)}
            />
          </View>
        </Animated.View>

        {/* Abilities Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: heroBg }]}>
            Abilities
          </Text>
          <View style={styles.abilitiesRow}>
            {pokemon.abilities.map((a) => (
              <View key={a.ability.name} style={styles.abilityChip}>
                <Text style={styles.abilityText}>
                  {formatPokemonName(a.ability.name)}
                </Text>
                {a.is_hidden ? (
                  <Text style={styles.hiddenLabel}>Hidden</Text>
                ) : null}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Base Stats Section */}
        <Animated.View
          entering={FadeInDown.delay(350).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: heroBg }]}>
            Base Stats
          </Text>
          <View style={styles.statsContainer}>
            {pokemon.stats.map((s, i) => (
              <StatBar
                key={s.stat.name}
                label={STAT_LABELS[s.stat.name] ?? s.stat.name}
                value={s.base_stat}
                index={i}
              />
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOT</Text>
              <Text style={styles.totalValue}>{totalStats}</Text>
            </View>
          </View>
        </Animated.View>

        {/* More Stats Button */}
        {onExploreMoreStats ? (
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <Pressable
              style={[styles.moreStatsButton, { backgroundColor: heroBg }]}
              onPress={() => onExploreMoreStats(id)}
            >
              <Text style={styles.moreStatsText}>Explore More Stats</Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.red,
    fontWeight: "500",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.red,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  hero: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 48,
  },
  contentCard: {
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: "continuous",
    backgroundColor: colors.backgroundLight,
    paddingTop: 4,
    paddingBottom: 100,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  heroId: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: 1,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroSprite: {
    width: 180,
    height: 180,
  },
  heroName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderCurve: "continuous",
    paddingVertical: 16,
    boxShadow: `0 2px 8px ${colors.shadow}`,
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
  abilityChip: {
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    boxShadow: `0 1px 4px ${colors.shadow}`,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  hiddenLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  statsContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderCurve: "continuous",
    padding: 16,
    gap: 10,
    boxShadow: `0 2px 8px ${colors.shadow}`,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 2,
  },
  totalLabel: {
    width: 36,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  totalValue: {
    width: 32,
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "right",
  },
  moreStatsButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  moreStatsText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
});

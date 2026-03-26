import { GenderBar } from "@/src/components/GenderBar";
import { InfoPill } from "@/src/components/InfoPill";
import type { EvoStage } from "@/src/components/pokemon";
import { EvolutionRow, flattenEvolutionChain } from "@/src/components/pokemon";
import { StatMeter } from "@/src/components/StatMeter";
import { fetchEvolutionChain, fetchPokemonSpecies } from "@/src/lib/pokeapi";
import { formatPokemonName } from "@/src/lib/pokemon-name";
import { colors } from "@/src/lib/theme";
import type { PokemonSpecies } from "@/src/types/pokemon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatsModal() {
  const { id, origin } = useLocalSearchParams<{
    id: string;
    origin: "pokedex" | "favorites";
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evoStages, setEvoStages] = useState<EvoStage[][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    if (!id) {
      setLoading(false);
      setError("Missing Pokémon id.");
      return;
    }
    setLoading(true);
    setError(null);

    fetchPokemonSpecies(id)
      .then(async (speciesData) => {
        setSpecies(speciesData);
        const evoData = await fetchEvolutionChain(
          speciesData.evolution_chain.url,
        );
        setEvoStages(flattenEvolutionChain(evoData.chain));
      })
      .catch(() => setError("Failed to load Pokémon data."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={styles.loadingText}>Loading stats…</Text>
      </View>
    );
  }

  if (error || !species) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Something went wrong."}</Text>
        <Pressable style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const flavorEntry = species.flavor_text_entries.find(
    (e) => e.language.name === "en",
  );
  const flavorText = flavorEntry?.flavor_text
    .replace(/\f/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const genus =
    species.genera.find((g) => g.language.name === "en")?.genus ?? "";

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{formatPokemonName(species.name)}</Text>
        {genus ? <Text style={styles.genus}>{genus}</Text> : null}
        {species.is_legendary || species.is_mythical ? (
          <View style={styles.badgeRow}>
            {species.is_legendary ? (
              <View style={[styles.rareBadge, { backgroundColor: "#FFD700" }]}>
                <Text style={styles.rareBadgeText}>Legendary</Text>
              </View>
            ) : null}
            {species.is_mythical ? (
              <View style={[styles.rareBadge, { backgroundColor: "#E040FB" }]}>
                <Text style={styles.rareBadgeText}>Mythical</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Pokédex Entry */}
      {flavorText ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pokédex Entry</Text>
          <View style={styles.card}>
            <Text style={styles.flavorText}>{flavorText}</Text>
          </View>
        </View>
      ) : null}

      {/* Training */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Training</Text>
        <View style={styles.card}>
          <View style={styles.metersCol}>
            <StatMeter
              value={species.capture_rate}
              maxValue={255}
              label="Capture Rate"
              color={colors.red}
            />
            <StatMeter
              value={species.base_happiness}
              maxValue={255}
              label="Base Happiness"
              color="#FFB74D"
            />
          </View>
        </View>
      </View>

      {/* Quick Info Pills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.pillsGrid}>
          <InfoPill
            label="Growth"
            value={formatPokemonName(species.growth_rate.name)}
          />
          <InfoPill
            label="Habitat"
            value={
              species.habitat
                ? formatPokemonName(species.habitat.name)
                : "Unknown"
            }
          />
          <InfoPill
            label="Egg Groups"
            value={species.egg_groups
              .map((g) => formatPokemonName(g.name))
              .join(", ")}
          />
        </View>
      </View>

      {/* Gender Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender Ratio</Text>
        <View style={styles.card}>
          <GenderBar rate={species.gender_rate} />
        </View>
      </View>

      {/* Evolution Chain */}
      {evoStages && evoStages.length > 1 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evolution Chain</Text>
          <View style={styles.card}>
            <EvolutionRow
              stages={evoStages}
              currentId={id ?? ""}
              onPokemonPress={(evoId) => {
                const detailPath =
                  origin === "favorites"
                    ? "/(tabs)/favorites/[id]"
                    : "/(tabs)/pokedex/[id]";
                if (origin === "pokedex") router.dismiss();
                setTimeout(() => {
                  router.navigate({
                    pathname: detailPath,
                    params: { id: evoId },
                  });
                }, 100);
              }}
            />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {},
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
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
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 8,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  genus: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  rareBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  rareBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.red,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderCurve: "continuous",
    padding: 16,
    boxShadow: `0 2px 8px ${colors.shadow}`,
  },
  flavorText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    lineHeight: 22,
    fontStyle: "italic",
  },
  metersCol: {
    gap: 16,
  },
  pillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

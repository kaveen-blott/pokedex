import {
  fetchEvolutionChain,
  fetchPokemonSpecies,
  getPokemonArtworkUrl,
  getPokemonId,
} from "@/src/lib/pokeapi";
import { colors } from "@/src/lib/theme";
import type { EvolutionChainLink, PokemonSpecies } from "@/src/types/pokemon";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function capitalize(str: string): string {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

interface EvoStage {
  name: string;
  id: string;
}

function flattenEvolutionChain(link: EvolutionChainLink): EvoStage[][] {
  const stages: EvoStage[][] = [];

  function walk(node: EvolutionChainLink, depth: number) {
    if (!stages[depth]) stages[depth] = [];
    stages[depth].push({
      name: node.species.name,
      id: getPokemonId(node.species.url),
    });
    for (const child of node.evolves_to) {
      walk(child, depth + 1);
    }
  }

  walk(link, 0);
  return stages;
}

function GenderBar({ rate }: { rate: number }) {
  if (rate === -1) {
    return (
      <View style={genderStyles.container}>
        <Text style={genderStyles.genderless}>Genderless</Text>
      </View>
    );
  }

  const femalePercent = (rate / 8) * 100;
  const malePercent = 100 - femalePercent;

  return (
    <View style={genderStyles.container}>
      <View style={genderStyles.labels}>
        <View style={genderStyles.labelRow}>
          <View style={[genderStyles.dot, { backgroundColor: "#5B9BD5" }]} />
          <Text style={genderStyles.maleLabel}>
            Male {malePercent.toFixed(0)}%
          </Text>
        </View>
        <View style={genderStyles.labelRow}>
          <View style={[genderStyles.dot, { backgroundColor: "#F06292" }]} />
          <Text style={genderStyles.femaleLabel}>
            Female {femalePercent.toFixed(0)}%
          </Text>
        </View>
      </View>
      <View style={genderStyles.barBg}>
        <View style={[genderStyles.maleFill, { width: `${malePercent}%` }]} />
        <View
          style={[genderStyles.femaleFill, { width: `${femalePercent}%` }]}
        />
      </View>
    </View>
  );
}

function StatMeter({
  value,
  maxValue,
  label,
  color,
}: {
  value: number;
  maxValue: number;
  label: string;
  color: string;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <View style={meterStyles.container}>
      <Text style={[meterStyles.value, { color }]}>{value}</Text>
      <View style={meterStyles.barBg}>
        <View
          style={[
            meterStyles.barFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={meterStyles.label}>{label}</Text>
    </View>
  );
}

function EvolutionRow({
  stages,
  currentId,
  onPokemonPress,
}: {
  stages: EvoStage[][];
  currentId: string;
  onPokemonPress: (id: string) => void;
}) {
  return (
    <View style={evoStyles.chain}>
      {stages.map((stage, stageIndex) => (
        <View key={stageIndex} style={evoStyles.stageGroup}>
          {stageIndex > 0 ? (
            <View style={evoStyles.arrowContainer}>
              <Text style={evoStyles.arrow}>›</Text>
            </View>
          ) : null}
          {stage.map((pokemon) => {
            const isCurrent = pokemon.id === currentId;
            return (
              <Pressable
                key={pokemon.id}
                style={[
                  evoStyles.evoCard,
                  isCurrent ? evoStyles.evoCardActive : null,
                ]}
                disabled={isCurrent}
                onPress={() => !isCurrent && onPokemonPress(pokemon.id)}
              >
                <Image
                  source={{ uri: getPokemonArtworkUrl(pokemon.id) }}
                  style={evoStyles.evoSprite}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  transition={200}
                />
                <Text
                  style={[
                    evoStyles.evoName,
                    isCurrent ? evoStyles.evoNameActive : null,
                  ]}
                  numberOfLines={1}
                >
                  {capitalize(pokemon.name)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={pillStyles.pill}>
      <Text style={pillStyles.label}>{label}</Text>
      <Text style={pillStyles.value}>{value}</Text>
    </View>
  );
}

export default function StatsModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

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

  const capturePercent = ((species.capture_rate / 255) * 100).toFixed(1);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{capitalize(species.name)}</Text>
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
            value={capitalize(species.growth_rate.name)}
          />
          <InfoPill
            label="Habitat"
            value={
              species.habitat ? capitalize(species.habitat.name) : "Unknown"
            }
          />
          <InfoPill label="Catch %" value={`${capturePercent}%`} />
          <InfoPill
            label="Egg Groups"
            value={species.egg_groups.map((g) => capitalize(g.name)).join(", ")}
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
                router.dismiss();
                router.push({
                  pathname: "/(tabs)/pokedex/[id]",
                  params: { id: evoId },
                });
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
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 60 : 124,
  },
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

const meterStyles = StyleSheet.create({
  container: {
    gap: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
});

const genderStyles = StyleSheet.create({
  container: {
    gap: 10,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  maleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5B9BD5",
  },
  femaleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F06292",
  },
  genderless: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
  },
  barBg: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  maleFill: {
    backgroundColor: "#5B9BD5",
    height: 10,
  },
  femaleFill: {
    backgroundColor: "#F06292",
    height: 10,
  },
});

const evoStyles = StyleSheet.create({
  chain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  stageGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  arrowContainer: {
    paddingHorizontal: 2,
  },
  arrow: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: "300",
  },
  evoCard: {
    alignItems: "center",
    padding: 6,
    borderRadius: 12,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: "transparent",
    width: 80,
    gap: 2,
  },
  evoCardActive: {
    borderColor: colors.red,
    backgroundColor: "rgba(220, 10, 45, 0.05)",
  },
  evoSprite: {
    width: 52,
    height: 52,
  },
  evoName: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  evoNameActive: {
    color: colors.red,
    fontWeight: "800",
  },
});

const pillStyles = StyleSheet.create({
  pill: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderCurve: "continuous",
    paddingHorizontal: 14,
    paddingVertical: 12,
    boxShadow: `0 1px 4px ${colors.shadow}`,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});

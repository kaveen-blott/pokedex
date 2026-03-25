import {
  fetchPokemonDetails,
  getPokemonArtworkUrl,
  TYPE_COLORS,
} from "@/src/lib/pokeapi";
import { colors } from "@/src/lib/theme";
import type { PokemonDetails } from "@/src/types/pokemon";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "SPD",
};

const STAT_MAX = 255;

const POKEMON_NAME_MAP: Record<string, string> = {
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "mr-mime": "Mr. Mime",
  "deoxys-normal": "Deoxys",
  farfetchd: "Farfetch'd",
};

function formatPokemonName(name: string): string {
  if (POKEMON_NAME_MAP[name]) return POKEMON_NAME_MAP[name];
  return name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function formatHeight(dm: number): string {
  const m = dm / 10;
  return `${m.toFixed(1)} m`;
}

function formatWeight(hg: number): string {
  const kg = hg / 10;
  return `${kg.toFixed(1)} kg`;
}

function getStatColor(value: number): string {
  if (value < 50) return "#F44336";
  if (value < 80) return "#FF9800";
  if (value < 100) return "#FFC107";
  if (value < 130) return "#8BC34A";
  return "#4CAF50";
}

function StatBar({ label, value }: { label: string; value: number }) {
  const percentage = Math.min((value / STAT_MAX) * 100, 100);

  return (
    <View style={statStyles.row}>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={statStyles.value}>{value}</Text>
      <View style={statStyles.barBackground}>
        <View
          style={[
            statStyles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: getStatColor(value),
            },
          ]}
        />
      </View>
    </View>
  );
}

const DARK_TEXT_TYPES = new Set([
  "electric",
  "ice",
  "normal",
  "fairy",
  "ground",
]);

function TypeBadge({ name }: { name: string }) {
  const bgColor = TYPE_COLORS[name] ?? colors.textMuted;
  const textColor = DARK_TEXT_TYPES.has(name) ? "#2E2E2E" : "#FFFFFF";

  return (
    <View style={[typeStyles.badge, { backgroundColor: bgColor }]}>
      <Text style={[typeStyles.text, { color: textColor }]}>
        {formatPokemonName(name)}
      </Text>
    </View>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.card}>
      <Text style={infoStyles.value}>{value}</Text>
      <Text style={infoStyles.label}>{label}</Text>
    </View>
  );
}

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid Pokémon id.");
      return;
    }
    setLoading(true);
    setError(null);
    fetchPokemonDetails(id)
      .then((data) => {
        setPokemon(data);
        navigation.setOptions({ title: formatPokemonName(data.name) });
      })
      .catch(() => setError("Failed to load Pokémon details."))
      .finally(() => setLoading(false));
  }, [id, navigation]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={styles.loadingText}>Loading details…</Text>
      </View>
    );
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
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: heroBg }]}>
        <Text style={styles.heroId}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <Image
          source={{ uri: getPokemonArtworkUrl(String(pokemon.id)) }}
          style={styles.heroSprite}
          contentFit="contain"
          transition={300}
          cachePolicy="memory-disk"
        />
        <Text style={styles.heroName}>{formatPokemonName(pokemon.name)}</Text>
        <View style={styles.typesRow}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} name={t.type.name} />
          ))}
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: heroBg }]}>About</Text>
        <View style={styles.infoRow}>
          <InfoCard label="Height" value={formatHeight(pokemon.height)} />
          <View style={styles.infoDivider} />
          <InfoCard label="Weight" value={formatWeight(pokemon.weight)} />
          <View style={styles.infoDivider} />
          <InfoCard label="Base Exp" value={String(pokemon.base_experience)} />
        </View>
      </View>

      {/* Abilities Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: heroBg }]}>Abilities</Text>
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
      </View>

      {/* Base Stats Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: heroBg }]}>Base Stats</Text>
        <View style={styles.statsContainer}>
          {pokemon.stats.map((s) => (
            <StatBar
              key={s.stat.name}
              label={STAT_LABELS[s.stat.name] ?? s.stat.name}
              value={s.base_stat}
            />
          ))}
          <View style={statStyles.totalRow}>
            <Text style={statStyles.totalLabel}>TOT</Text>
            <Text style={statStyles.totalValue}>{totalStats}</Text>
          </View>
        </View>
      </View>

      {/* More Stats Button */}
      <Pressable
        style={[styles.moreStatsButton, { backgroundColor: heroBg }]}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/pokedex/stats-modal",
            params: { id },
          })
        }
      >
        <Text style={styles.moreStatsText}>Explore More Stats</Text>
      </Pressable>
    </ScrollView>
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
  hero: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderCurve: "continuous",
  },
  heroId: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: 1,
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

const statStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    width: 36,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  value: {
    width: 32,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
  },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: 3,
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
});

const typeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});

const infoStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
  },
});

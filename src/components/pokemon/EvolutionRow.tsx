import { getPokemonArtworkUrl, getPokemonId } from "@/src/lib/pokeapi";
import { formatPokemonName } from "@/src/lib/pokemon-name";
import { colors } from "@/src/lib/theme";
import type { EvolutionChainLink } from "@/src/types/pokemon";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface EvoStage {
  name: string;
  id: string;
}

export function flattenEvolutionChain(link: EvolutionChainLink): EvoStage[][] {
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

export function EvolutionRow({
  stages,
  currentId,
  onPokemonPress,
}: {
  stages: EvoStage[][];
  currentId: string;
  onPokemonPress: (id: string) => void;
}) {
  return (
    <View style={styles.chain}>
      {stages.map((stage, stageIndex) => (
        <View key={stageIndex} style={styles.stageGroup}>
          {stageIndex > 0 ? (
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>›</Text>
            </View>
          ) : null}
          {stage.map((pokemon) => {
            const isCurrent = pokemon.id === currentId;
            return (
              <Pressable
                key={pokemon.id}
                style={[
                  styles.evoCard,
                  isCurrent ? styles.evoCardActive : null,
                ]}
                disabled={isCurrent}
                onPress={() => !isCurrent && onPokemonPress(pokemon.id)}
              >
                <Image
                  source={{ uri: getPokemonArtworkUrl(pokemon.id) }}
                  style={styles.evoSprite}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  transition={200}
                />
                <Text
                  style={[
                    styles.evoName,
                    isCurrent ? styles.evoNameActive : null,
                  ]}
                  numberOfLines={1}
                >
                  {formatPokemonName(pokemon.name)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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

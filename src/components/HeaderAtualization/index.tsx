
import { useState, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Easing,
} from "react-native";

import {
  HeaderBox,
  HeaderTitle,
  TopBox,
  UpdateButton,
  ProgressContainer,
  ProgressRow,
  ProgressIcon,
  ProgressBarBackground,
  ProgressBarFill,
  ProgressPercentage,
  ProgressCounter,
} from "./styles";

import Ionicons from "@expo/vector-icons/Ionicons";

import { CharCount } from "../../utils/caracterCounter";
import { useRealm } from "../../context/RealmContext";
import { getAllMangas } from "../../database/Crud/manga";
import { getUpdateChaptersAll } from "../../database/Crud/updateChapters";
import { lookForUpdate } from "./action";

interface HeaderAtualizationProps {
  name?: string | null;
}

export default function HeaderAtualization({
  name,
}: HeaderAtualizationProps) {
  const { realm, isLoading } = useRealm();

  const [isSearching, setIsSearching] = useState(false);

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
  });

  const searchingRef = useRef(false);
  const mountedRef = useRef(true);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Controla o ciclo de vida do componente
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      searchingRef.current = false;

      rotateAnim.stopAnimation();
      progressAnim.stopAnimation();
    };
  }, [rotateAnim, progressAnim]);

  // Animação da ampulheta
  useEffect(() => {
    if (!isSearching) {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [isSearching, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const percentage =
    progress.total > 0
      ? Math.min(
          100,
          Math.round(
            (progress.current / progress.total) * 100
          )
        )
      : 0;

  const updateProgress = (
    current: number,
    total: number
  ) => {
    if (!mountedRef.current) return;

    const newPercentage =
      total > 0
        ? Math.min(100, (current / total) * 100)
        : 0;

    setProgress({
      current,
      total,
    });

    Animated.timing(progressAnim, {
      toValue: newPercentage,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  const handlePress = async () => {
    if (
      !realm ||
      isLoading ||
      searchingRef.current
    ) {
      return;
    }

    // Bloqueia execuções simultâneas
    searchingRef.current = true;

    try {
      setIsSearching(true);

      // Reinicia o progresso
      progressAnim.stopAnimation();
      progressAnim.setValue(0);

      setProgress({
        current: 0,
        total: 0,
      });

      // Carrega os mangás
      const mangasResults = await getAllMangas(realm);

      if (!mangasResults) {
        throw new Error(
          "Não foi possível carregar os mangás."
        );
      }

      const mangas = Array.from(mangasResults);

      // Carrega os capítulos existentes
      const chaptersResults =
        await getUpdateChaptersAll(realm);

      if (!chaptersResults) {
        throw new Error(
          "Não foi possível carregar os capítulos."
        );
      }

      const chapters = Array.from(chaptersResults);

      if (!mountedRef.current) return;

      updateProgress(0, mangas.length);

      // Executa a sincronização
      const result = await lookForUpdate(
        realm,
        mangas,
        chapters,
        (current: number, total: number) => {
          updateProgress(current, total);

          console.log(
            `Progresso: ${current}/${total}`
          );
        }
      );

      if (!mountedRef.current) return;

      // Resultado final
      const message =
        `Verificação finalizada!\n\n` +
        `Operações: ${result.totalOperations}\n` +
        `Novos capítulos: ${result.totalCreated}\n` +
        `Capítulos removidos: ${result.totalDeleted}\n` +
        `Erros: ${result.totalErrors}`;

      if (result.success) {
        Alert.alert(
          "Atualização concluída!",
          message
        );
      } else {
        Alert.alert(
          "Atualização concluída com avisos",
          message
        );
      }

    } catch (error: unknown) {
      console.error(
        "Erro na atualização:",
        error
      );

      if (!mountedRef.current) return;

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado.";

      Alert.alert(
        "Erro na atualização",
        errorMessage
      );

    } finally {
      // Sempre libera o bloqueio
      searchingRef.current = false;

      if (mountedRef.current) {
        setIsSearching(false);
      }

      progressAnim.stopAnimation();

      if (mountedRef.current) {
        progressAnim.setValue(0);
      }
    }
  };

  return (
    <HeaderBox>
      <TopBox>
        <HeaderTitle>
          {isSearching ? "" : CharCount(name ?? "")}
        </HeaderTitle>

        <UpdateButton
          onPress={handlePress}
          disabled={isSearching || isLoading}
        >
          <Ionicons
            name="sync-circle-outline"
            size={24}
            color="white"
          />
        </UpdateButton>
      </TopBox>

      {isSearching && (
        <ProgressContainer>
          <ProgressRow>
            <ProgressIcon>
              <Animated.View
                style={{
                  transform: [{ rotate: rotation }],
                }}
              >
                <Ionicons
                  name="hourglass-outline"
                  size={23}
                  color="#4ADE80"
                />
              </Animated.View>
            </ProgressIcon>

            <ProgressBarBackground>
              <ProgressBarFill
                style={{
                  width: animatedWidth,
                }}
              />
            </ProgressBarBackground>

            <ProgressPercentage>
              {percentage}%
            </ProgressPercentage>
          </ProgressRow>

          <ProgressCounter>
            {progress.current} de {progress.total} títulos verificados
          </ProgressCounter>
        </ProgressContainer>
      )}
    </HeaderBox>
  );
}

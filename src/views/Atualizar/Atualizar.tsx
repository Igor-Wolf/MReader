
import React, { useEffect, useState, useCallback } from "react";

import {
  FlatList,
  View,
  Text,
} from "react-native";

import {
  ChapterBottomBox,
  ChapterBox,
  ChapterBoxExternal,
  ChapterTextBottom,
  ChapterTextTop,
  ChapterTopBox,
  Container,
  DividerText,
  ImageMangaChapter,
  MangaContainer,
  OrderChapterBox,
  StyledPicker,
  TextOrderChapterBox,
  TopContainer,
  TopText,
} from "./styles";

import HeaderAtualization from "../../components/HeaderAtualization";
import { useRealm } from "../../context/RealmContext";
import { getUpdateChaptersAll } from "../../database/Crud/updateChapters";
import ChapterUpdatePopup from "../../components/ChapterUpdatePopup";
import { useNavigation } from "@react-navigation/native";
import { toggleReadChapter } from "../../database/Crud/readChapter";
import { Picker } from "@react-native-picker/picker";

export default function Atualizar() {
  const navigation = useNavigation<any>();
  const { realm, isLoading } = useRealm();

  const [chapterList, setChapterList] = useState<any[]>([]);
  const [lastDays, setLastDays] = useState("1");

  // Atualiza e filtra os resultados do Realm
  useEffect(() => {
    if (!realm || isLoading) return;

    let results: any = null;

    const updateList = () => {
      try {
        const days = Number(lastDays);

        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        const filteredList = Array.from(results).filter(
          (item: any) => {
            if (!item.dateUpdate) return false;

            const itemDate = new Date(item.dateUpdate);

            return (
              !Number.isNaN(itemDate.getTime()) &&
              itemDate >= dateLimit
            );
          }
        );

        const sortedList = filteredList.sort(
          (a: any, b: any) =>
            new Date(b.dateUpdate).getTime() -
            new Date(a.dateUpdate).getTime()
        );

        setChapterList(sortedList);

      } catch (error: any) {
        console.error(
          "Erro ao atualizar capítulos:",
          error?.message || error
        );
      }
    };

    try {
      results = getUpdateChaptersAll(realm);

      updateList();

      // Listener para atualizações em tempo real do Realm
      results.addListener(updateList);

    } catch (error: any) {
      console.error(
        "Erro ao carregar capítulos:",
        error?.message || error
      );

      setChapterList([]);
    }

    // Cleanup executado corretamente pelo React
    return () => {
      if (results && !results.isInvalidated) {
        results.removeListener(updateList);
      }
    };

  }, [realm, isLoading, lastDays]);

  // Abrir capítulo
  const onPressChapter = useCallback((item: any) => {
    const objeto = {
      currentChapter: {
        id: item.id,
        idFont: item.idFont,
        idManga: item.idManga,
        titleManga: item.titleManga,
        coverImage: item.coverImage,
        chapterNumber: item.chapterNumber,
        title: item.title,
      },
    };

    navigation.navigate("Reader", { objeto });

  }, [navigation]);

  // Marcar como lido
  const onLongPressChapter = useCallback(async (item: any) => {
    await toggleReadChapter(realm, {
      idChap: item.id?.toString(),
      idFont: item.idFont,
      idManga: item.idManga?.toString(),
      titleManga: item.titleManga,
      coverImage: item.coverImage,
      chapterNumber: item.chapterNumber?.toString(),
      title: item.title,
    });

  }, [realm]);

  // Abrir detalhes do mangá
  const handlePressImage = useCallback((item: any) => {
    const objeto = {
      idFont: item.idFont,
      id: item.idManga?.toString(),
      slug: item.titleManga,
      coverImage: item.coverImage,
    };

    navigation.navigate("MangaDetails", { objeto });

  }, [navigation]);

  // Renderização de cada capítulo
  const renderItem = useCallback(({ item, index }: any) => {

    const currentDate = new Date(
      item.dateUpdate
    ).toLocaleDateString("pt-BR");

    const previousItem = chapterList[index - 1];

    const previousDate = previousItem
      ? new Date(previousItem.dateUpdate).toLocaleDateString("pt-BR")
      : null;

    const showDate = currentDate !== previousDate;

    return (
      <>
        {showDate && (
          <DividerText>
            {currentDate}
          </DividerText>
        )}

        <ChapterBoxExternal>
          <MangaContainer
            onPress={() => handlePressImage(item)}
          >
            <ImageMangaChapter
              source={{ uri: item.coverImage }}
              contentFit="cover"
            />
          </MangaContainer>

          <ChapterBox
            onPress={() => onPressChapter(item)}
            onLongPress={() => onLongPressChapter(item)}
          >
            <ChapterUpdatePopup
              idFont={item.idFont}
              idManga={item.idManga}
              idChap={item.id}
            />

            <ChapterTopBox>
              {item.titleManga && (
                <ChapterTextTop
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ flex: 1 }}
                >
                  {item.titleManga}
                </ChapterTextTop>
              )}
            </ChapterTopBox>

            <ChapterBottomBox>
              {item.chapterNumber && (
                <ChapterTextBottom>
                  Ch.{item.chapterNumber}
                </ChapterTextBottom>
              )}

              <ChapterTextBottom>
                {" - "}
              </ChapterTextBottom>

              <ChapterTextBottom
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flex: 1 }}
              >
                {item.title}
              </ChapterTextBottom>
            </ChapterBottomBox>
          </ChapterBox>
        </ChapterBoxExternal>
      </>
    );

  }, [
    chapterList,
    handlePressImage,
    onPressChapter,
    onLongPressChapter,
  ]);

  // Cabeçalho da lista
  const ListHeader = (
    <TopContainer>
      <TopText>Últimas atualizações</TopText>

      <OrderChapterBox>
        <TextOrderChapterBox>
          {lastDays}d
        </TextOrderChapterBox>

        <StyledPicker
          selectedValue={lastDays}
          onValueChange={(value: string) => setLastDays(value)}
          mode="dropdown"
          dropdownIconColor="#FF6347"
        >
          <Picker.Item label="1" value="1" />
          <Picker.Item label="7" value="7" />
          <Picker.Item label="15" value="15" />
          <Picker.Item label="30" value="30" />
        </StyledPicker>
      </OrderChapterBox>
    </TopContainer>
  );

  return (
    <Container>
      <HeaderAtualization name="Atualizar" />

      <FlatList
        data={chapterList}
        renderItem={renderItem}
        keyExtractor={(item) =>
          `${item.idFont}-${item.idManga}-${item.id}`
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "gray" }}>
              Nenhuma atualização encontrada neste período.
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

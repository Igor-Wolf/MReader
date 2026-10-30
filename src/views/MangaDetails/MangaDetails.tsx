import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Alert,
  Button,
  Image,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ChapterBottomBox,
  ChapterBox,
  ChapterTextBottom,
  ChapterTextTop,
  ChapterTopBox,
  Container,
  ImageManga,
  InfoContainer,
  MidleContainer,
  NewLangBox,
  NormalText,
  NormalTextTop,
  OrderChapterBox,
  ScrollContainer,
  StyledPicker,
  TagsBox,
  TagsContainer,
  TextOrderChapterBox,
  TitleManga,
  TopContainer,
} from "./styles";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
} from "../../Models/MangaModel";
import {
  GetChapterList,
  GetChapterListAnotherLanguage,
  GetMangaDetails,
} from "./action";
import { useEffect, useState } from "react";
import { DateConvert } from "../../utils/convertDate";
import HeaderChapters from "../../components/HeaderChapters";
import { createManga } from "../../database/Crud/manga";
import { useRealm } from "../../context/RealmContext";
import ChapterPopup from "../../components/ChapterPopup";
import { toggleReadChapter } from "../../database/Crud/readChapter";
import { Picker } from "@react-native-picker/picker";
import {
  createChapterAll,
  deleteAllChaptersAll,
} from "../../database/Crud/allChapters";
import DownloadButton from "../../components/DownloadButton";

export default function MangaDetails() {
  const navigation = useNavigation();
  const { realm, isLoading } = useRealm();

  const route = useRoute();
  const manga: MangaCoverModel = route.params?.objeto;

  // Estados para controla loading e erro do refresh

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [shouldExpandDescription, setShouldExpandDescription] = useState(false);
  const [isCheckingLib, setIsCheckingLib] = useState(true);

  const [inLibrary, setInLibrary] = useState(false);
  const [orderChapterBox, setOrderChapterBox] = useState("Z-A");

  // Função para verificar se o mangá já está na biblioteca
  const checkMangaInLibrary = async (): Promise<boolean> => {
    if (!realm || !manga.idFont || !manga.id) return false;

    const uid = `${manga.idFont}:${String(manga.id)}`;
    console.log("🔍 Verificando existência no Realm:", uid);

    try {
      // O objectForPrimaryKey retorna null se não existir, ou o objeto se existir
      const mangaObj = realm.objectForPrimaryKey("Manga", uid);
      const exists = !!mangaObj;
      console.log(
        `📚 Mangá "${manga.id}" (uid: ${uid}):`,
        exists ? "✅ ENCONTRADO" : "❌ NÃO ENCONTRADO",
      );
      return exists;
    } catch (error) {
      console.error(
        "Erro ao verificar existência do mangá na biblioteca:",
        error,
      );
      return false;
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [mangaDetails, setMangaDetails] = useState<MangaDetailsModel | null>(
    null,
  );
  const [chapterList, setChapterList] = useState<MangaChapterModel[]>([]);
  const fetchManga = async () => {
    const response = await GetMangaDetails(manga.idFont, manga.id);
    if (response) {
      setMangaDetails(response);
      return true;
    }
    console.warn("⚠️ API retornou null para este mangá");
    return false;
  };

  const fetchChapterList = async () => {
    const response = await GetChapterList(realm, manga.idFont, manga.id);
    if (response) {
      setChapterList(response);
      setOrderChapterBox("Z-A");

      return true;
    }
    console.warn("⚠️ Nenhum capítulo encontrado para este mangá");
    return false;
  };
  const fetchChapterListByLang = async (lang: string) => {
    const response = await GetChapterListAnotherLanguage(
      manga.idFont,
      manga.id,
      lang,
    );
    if (response) {
      setChapterList(response);
      setOrderChapterBox("Z-A");
    }
  };

  const refreshPage = async () => {
    if (refreshLoading) return; // Evita múltiplos refreshes simultâneos

    console.log("🔄 Refresh button pressionado");

    try {
      setRefreshLoading(true);

      await Promise.all([fetchManga(), fetchChapterList()]);

      console.log("✅ Dados do mangá atualizados com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao atualizar dados:", error);
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleRefresh = () => {
    refreshPage();
  };

  const onPressChapter = (chapter: string, indexList: number) => {
    const objeto = {
      currentChapter: {
        id: chapter,
        idFont: manga.idFont,
        idManga: manga.id,
        titleManga: manga.slug,
        coverImage: manga.coverImage,
        chapterNumber: chapterList[indexList].chapter,
        title: chapterList[indexList].title,
      },
    };

    navigation.navigate("Reader", { objeto });
  };

  const onLongPressChapter = async (chapter: string, indexList: number) => {
    const chapterData = {
      idChap: chapter?.toString(),
      idFont: manga.idFont,
      idManga: manga.id?.toString(),
      titleManga: manga.slug,
      coverImage: manga.coverImage,
      chapterNumber: chapterList[indexList].chapter?.toString(),
      title: chapterList[indexList].title,
    };

    const message = await toggleReadChapter(realm, chapterData);
  };

  const handlePressAdd = async () => {
    try {
      const response: string = await createManga(realm, {
        id: manga.id,
        idFont: manga.idFont,
        slug: manga.slug,
        coverImage: manga.coverImage,
      });

      if (response === "Adicionado") {
        for (const chap of chapterList) {
          const chapterData = {
            idChap: chap.id?.toString(),
            idFont: manga.idFont,
            idManga: manga.id?.toString(),
            titleManga: manga.slug,
            coverImage: manga.coverImage,
            chapterNumber: chap.chapter?.toString(),
            title: chap.title,
          };

          const message = await createChapterAll(realm, chapterData);
          // Você pode tratar ou armazenar a `message` aqui, se necessário
          setInLibrary(true);
        }
      } else {
        await deleteAllChaptersAll(realm);
        setInLibrary(false);
      }

      if (response) {
        alert(response);
      }
    } catch (error) {
      console.error("Erro ao adicionar manga ou capítulos:", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };
  // Verificar ordenaçãod a lista para crescente ou decrescente

  const handleOrder = async (value) => {
    if (value != orderChapterBox) {
      
      let sortedList = chapterList.reverse();
      setChapterList(sortedList);
    }
  };

  // Verificar na biblioteca ao montar (useEffect vazio garante rodar apenas 1 vez)
  useEffect(() => {
    console.log("📂 === MangaDetails Montando ===");
    console.log("   - manga.idFont:", manga?.idFont);
    console.log("   - manga.id:", manga?.id);
    console.log("   - realm disponível:", !!realm);
    console.log("   - isCheckingLib:", isCheckingLib);

    // Só verificar se temos dados suficientes
    if (manga?.idFont && manga?.id) {
      const uid = `${manga.idFont}:${String(manga.id)}`;
      console.log(`🔍 Verificando UID: ${uid}`);

      // Verificação imediata no banco, sem aguardar outros processos
      checkMangaInLibrary()
        .then((exists) => {
          const finalValue = exists ? "✅ ENCONTRADO" : "❌ NÃO ENCONTRADO";
          console.log(`💾 Resultado checkLib:`, finalValue);
          setInLibrary(exists);
          setIsCheckingLib(false);
        })
        .catch((err) => {
          console.error("❌ Erro ao verificar:", err.message || err);
          setIsCheckingLib(false);
        });
    } else {
      console.log("⚠️ Dados insuficientes para verificação");
      setIsCheckingLib(false);
    }
  }, []); // Vazio - roda APENAS na montagem do componente (1 vez)

  // Recarregar dados da API ao iniciar (RODA APENAS NA MONTAGEM)
  useEffect(() => {
    const loadData = async () => {
      console.log("🔄 Iniciando refreshPage...");
      await refreshPage();
      console.log("✅ Dados carregados!");
    };
    loadData();
  }, []);

  return (
    <Container>
      <HeaderChapters
        name={manga.slug}
        navigation={navigation}
      ></HeaderChapters>

      <ScrollContainer>
        <TopContainer>
          <ImageManga
            source={{
              uri: manga.coverImage
                ? manga.coverImage
                : (mangaDetails?.coverImage ?? undefined),
            }}
            contentFit="cover"
          />
          <InfoContainer>
            <TitleManga>{manga.slug}</TitleManga>
            <NormalTextTop>Artist: {mangaDetails?.artist}</NormalTextTop>
            <NormalTextTop>Autor: {mangaDetails?.author}</NormalTextTop>
            <NormalTextTop>Year: {mangaDetails?.year}</NormalTextTop>
            <NormalTextTop>Status: {mangaDetails?.status}</NormalTextTop>
          </InfoContainer>
        </TopContainer>
        {/* 🔑 BOTÕES DE CONTROLE - IGUAIS LADO A LADO (50/50) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            marginVertical: 15,
          }}
        >
          {/* Botão ADD */}
          <TouchableOpacity
            onPress={handlePressAdd}
            style={{
              backgroundColor: "#222",
              paddingVertical: 12,
              flex: 0.48,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#444",
            }}
            activeOpacity={0.7}
          >
            {!inLibrary && (
              <Ionicons
                name="heart-outline"
                size={18}
                color="tomato"
                style={{ marginRight: 6 }}
              />
            )}

            {inLibrary && (
              <Ionicons
                name="heart-sharp"
                size={18}
                color="tomato"
                style={{ marginRight: 6 }}
              />
            )}
            <Text style={{ color: "tomato", fontWeight: "bold", fontSize: 14 }}>
              Add
            </Text>
          </TouchableOpacity>

          {/* Botão REFRESH */}
          <TouchableOpacity
            onPress={handleRefresh}
            style={{
              backgroundColor: "#222",
              paddingVertical: 12,
              flex: 0.48,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#444",
            }}
            disabled={refreshLoading}
            activeOpacity={0.7}
          >
            <Ionicons
              name="refresh"
              size={18}
              color="tomato"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "tomato", fontWeight: "bold", fontSize: 14 }}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>

        {/* LOADING CENTRALIZADO SE ESTIVER RECARREGANDO */}
        {/* INDICADOR DE CARREGAMENTO */}
        {refreshLoading && (
          <View
            style={{
              position: "absolute",
              top: "40%",
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}
          >
            <ActivityIndicator
              style={{ zIndex: 5 }}
              size="large"
              color="#999"
            />
          </View>
        )}

        <MidleContainer>
          <NormalText numberOfLines={shouldExpandDescription ? undefined : 5}>
            {mangaDetails?.description}
          </NormalText>
          {mangaDetails?.description &&
            mangaDetails.description.length > 100 && (
              <TouchableOpacity
                onPress={() =>
                  setShouldExpandDescription(!shouldExpandDescription)
                }
                style={{ marginTop: 6, alignSelf: "flex-start" }}
              >
                <Text
                  style={{ color: "#FF6347", fontWeight: "bold", fontSize: 14 }}
                >
                  {shouldExpandDescription ? "Ler menos ▲" : "Ler mais... ▼"}
                </Text>
              </TouchableOpacity>
            )}
          <TagsContainer>
            {mangaDetails?.tags?.map((item, index) => (
              <TagsBox key={index}>
                <NormalText>{item}</NormalText>
              </TagsBox>
            ))}
          </TagsContainer>
        </MidleContainer>

        <NewLangBox>
          <ChapterTextTop style={{ paddingLeft: 5 }}>
            {chapterList?.length ? chapterList.length : null} Capítulos
          </ChapterTextTop>
          <OrderChapterBox>
            <TextOrderChapterBox>{orderChapterBox}</TextOrderChapterBox>
            <StyledPicker
              selectedValue={orderChapterBox}
              onValueChange={(value) => {
                handleOrder(value);
                setOrderChapterBox(value); // se quiser atualizar o estado também
              }}
              mode="dropdown"
              dropdownIconColor="#FF6347"
            >
              <Picker.Item label="A-Z" value="A-Z" />
              <Picker.Item label="Z-A" value="Z-A" />
            </StyledPicker>
          </OrderChapterBox>
          <StyledPicker
            selectedValue={selectedLanguage}
            onValueChange={(value) => {
              setSelectedLanguage(value); // se quiser atualizar o estado também
              fetchChapterListByLang(value); // chama a função com o valor selecionado
            }}
            mode="dropdown"
            dropdownIconColor="#FF6347"
          >
            <Picker.Item label="EN" value="en" />
            <Picker.Item label="PT" value="pt-br" />
            <Picker.Item label="ES" value="es" />
          </StyledPicker>
        </NewLangBox>
        {chapterList?.map((item, index) => (
          <ChapterBox
            key={index}
            onPress={() => onPressChapter(item.id, index)}
            onLongPress={() => onLongPressChapter(item.id, index)}
          >
            <ChapterPopup
              idFont={manga.idFont}
              idManga={manga.id}
              idChap={item.id}
            ></ChapterPopup>
            <ChapterTopBox>
              {item.volume && (
                <ChapterTextTop>Vol.{item.volume}</ChapterTextTop>
              )}
              {item.chapter && (
                <ChapterTextTop>Ch.{item.chapter}</ChapterTextTop>
              )}
              {item.title && (
                <ChapterTextTop
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ flex: 1 }}
                >
                  {item.title}
                </ChapterTextTop>
              )}
            </ChapterTopBox>
            <ChapterBottomBox>
              <ChapterTextBottom>
                {item.date ? item.date : null}
              </ChapterTextBottom>
              <ChapterTextBottom> - </ChapterTextBottom>
              <ChapterTextBottom
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flex: 1 }}
              >
                {item.scanName}
              </ChapterTextBottom>
            </ChapterBottomBox>
            <DownloadButton
              fontID={manga.idFont}
              mangaID={manga.id}
              chapterID={item.id}
              chapterAll={item}
            ></DownloadButton>
          </ChapterBox>
        ))}
      </ScrollContainer>
    </Container>
  );
}

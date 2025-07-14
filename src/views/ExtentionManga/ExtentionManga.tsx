import { MangaFontContext } from "../../context/FontContext";
import { useContext, useEffect, useState } from "react";
import { Container, FlatListContainer } from "./Styles";
import { useNavigation } from "@react-navigation/native";
import HeaderExtention from "../../components/HeaderExtentionFont";
import CardManga from "../../components/CardManga";
import { GetAllManga, GetMangaByName, GetPopularManga } from "./action";
import { ActivityIndicator, RefreshControl } from "react-native";

export default function ExtentionManga() {
  const { font } = useContext(MangaFontContext);
  const navigation = useNavigation();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [mangaList, setMangaList] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [operation, setOperation] = useState(1);
  const [inputText, setInputText] = useState("");

  const fetchManga = async (page: number, operator: number) => {
    let response = null;
    switch (operator) {
      case 1:
        response = await GetAllManga(font.id, page);
        break;
      case 2:
        response = await GetPopularManga(font.id, page);
        break;
      case 3:
        response = await GetMangaByName(
          font.id,
          page,
          inputText
        );
        break;
      default:
        break;
    }

    return response;
  };

  const refreshSearch = async () => {
    setOperation(3);

    setRefreshing(true);
    const response = await fetchManga(1, 3);
    if (response) {
      setMangaList(response);
      setPagination(1);
    }
    setRefreshing(false);
  };

  const refreshPopular = async () => {
    setOperation(2);

    setRefreshing(true);
    const response = await fetchManga(1, 2);
    if (response) {
      setMangaList(response);
      setPagination(1);
    }
    setRefreshing(false);
  };
  const refreshPage = async () => {
    setOperation(1);
    setRefreshing(true);
    const response = await fetchManga(1, 1);
    if (response) {
      setMangaList(response);
      setPagination(1);
    }
    setRefreshing(false);
  };

  const morePages = async () => {
    if (isLoadingMore || operation === 3) return;

    setIsLoadingMore(true);
    const numPage = pagination + 1;
    const response = await fetchManga(numPage, operation);

    if (response) {
      setMangaList((prevList) => [...prevList, ...response]);
      setPagination(numPage);
    }

    setIsLoadingMore(false);
  };

  useEffect(() => {
    refreshPage();
  }, [font.id]);

  return (
    <Container>
      <HeaderExtention
        name={font.name}
        navigation={navigation}
        refreshNew={refreshPage}
        refreshPopular={refreshPopular}
        refreshSearch={refreshSearch}
        setInputText={setInputText}
      ></HeaderExtention>

      <FlatListContainer
        data={mangaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <CardManga key={item.id} objeto={item} />}
        numColumns={2}
        horizontal={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
        }
        onEndReached={() => {
          morePages();
        }}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              style={{ zIndex: 5 }}
              size="large"
              color="#999"
            />
          ) : null
        }
      ></FlatListContainer>
    </Container>
  );
}

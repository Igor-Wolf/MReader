import { MangaFontContext } from "../../context/FontContext";
import { useContext, useEffect, useState } from "react";
import { Container, FlatListContainer } from "./Styles";
import { useNavigation } from "@react-navigation/native";
import HeaderExtention from "../../components/HeaderExtentionFont";
import CardManga from "../../components/CardManga";
import { GetAllManga } from "./action";
import { ActivityIndicator, RefreshControl } from "react-native";

export default function ExtentionManga() {
  const { font } = useContext(MangaFontContext);
  const navigation = useNavigation();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchManga = async (page: number) => {
    
    const response = await GetAllManga(font.id, page);
    if (response) {
      return response;
    }
  };

  const refreshPage = async () => {
    setRefreshing(true);
    const response = await fetchManga(1);
    if (response) {
      setMangaList(response);
    }
    setRefreshing(false);
  };

  const morePages = async () => {
    const numPage = pagination + 1;

    const response = await fetchManga(numPage);
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    if (response) {
      setMangaList((prevList) => [...prevList, ...response]);
      setPagination(numPage);
    }

    setIsLoadingMore(false);
  };

  const [mangaList, setMangaList] = useState([]);
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    
    refreshPage();
  }, [font.id]);

  return (
    <Container>
      <HeaderExtention
        name={font.name}
        navigation={navigation}
      ></HeaderExtention>

      <FlatListContainer
        data={mangaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <CardManga key={item.id} objeto={item} />
        )}
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

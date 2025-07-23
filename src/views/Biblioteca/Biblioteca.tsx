import { Text, View } from "react-native";
import { useRealm } from "../../context/RealmContext";
import { createManga, getAllMangas } from "../../database/Crud/manga";
import { useEffect, useState } from "react";
import { Container, FlatListContainer } from "./styles";
import CardManga from "../../components/CardManga";
import HeaderLib from "../../components/HeaderLib";

export default function Biblioteca() {
  const { realm, isLoading } = useRealm();
  const [filter, setFilter] = useState("");

  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    if (!realm || isLoading) return;

    const mangasResults = getAllMangas(realm);

    const updateList = () => {
      setMangaList(Array.from(mangasResults));
    };

    // Chama ao montar
    updateList();

    // Observa mudanças no banco
    mangasResults.addListener(updateList);

    // Limpa listener ao desmontar
    return () => {
      mangasResults.removeListener(updateList);
    };
  }, [realm, isLoading, filter]);

  const filteredMangaList = mangaList.filter((manga) =>
    manga.slug.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container>
      {<HeaderLib name={"Biblioteca"} setFilter={setFilter}></HeaderLib>}

      {mangaList.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "gray", fontSize: 16 }}>
            Nenhum Mangá adicionado ainda.
          </Text>
        </View>
      ) : (
        <FlatListContainer
          data={filteredMangaList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const { uid, ...itemWithoutUid } = item;
            return <CardManga key={item.id} objeto={itemWithoutUid} />;
          }}
          numColumns={2}
          horizontal={false}
        ></FlatListContainer>
      )}
    </Container>
  );
}

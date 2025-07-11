import { Text } from "react-native";
import { useRealm } from "../../context/RealmContext";
import { createManga, getAllMangas } from "../../database/Crud/manga";
import { useEffect, useState } from "react";
import { Container, FlatListContainer } from "./styles";
import HeaderExtention from "../../components/HeaderExtentionFont";
import CardManga from "../../components/CardManga";
import { useNavigation } from "@react-navigation/native";
import HeaderLib from "../../components/HeaderLib";

export default function Biblioteca() {
  const { realm, isLoading } = useRealm();
  const navigation = useNavigation();

  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    if (!realm || isLoading) return;

    // Buscar todos os mangás
    const mangas = getAllMangas(realm);
    setMangaList(Array.from(mangas));
  }, [realm, isLoading]);

  return (
    <Container>
      { <HeaderLib
          name={"Biblioteca"}
          
         
        ></HeaderLib> }

      <FlatListContainer
        data={mangaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const { uid, ...itemWithoutUid } = item;
          return <CardManga key={item.id} objeto={itemWithoutUid} />;
        }}
        numColumns={2}
        horizontal={false}
        //   refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
        //   }
      ></FlatListContainer>
    </Container>
  );
}

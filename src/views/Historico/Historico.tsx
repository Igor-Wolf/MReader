import { Text, View, ActivityIndicator } from "react-native";
import { useRealm } from "../../context/RealmContext"; 
import { getAllChapters } from "../../database/Crud/chapter"; 
import { useEffect, useState } from "react";
import CardChapter from "../../components/CardChapter"; 
import { Container, FlatListContainer } from "./styles";
import HeaderHistory from "../../components/HeaderHistory";

export default function Historico() {
  const { realm, isLoading } = useRealm();

  const [chapterList, setChapterList] = useState([]);

  useEffect(() => {
    // Só tenta buscar os capítulos se o Realm estiver pronto
    if (!realm || isLoading) return;

    const chaptersResults = getAllChapters(realm);

    const updateList = () => {
      setChapterList(Array.from(chaptersResults));
    };

    updateList();

    chaptersResults.addListener(updateList);

    return () => {
      chaptersResults.removeListener(updateList);
    };
  }, [realm, isLoading]);

  if (isLoading) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Carregando capítulos...</Text>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header  histórico de leitura */}
      {<HeaderHistory name={"Hitórico"}>
      
      </HeaderHistory>}

      {chapterList.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "gray", fontSize: 16 }}>
            Nenhum capítulo lido ainda.
          </Text>
        </View>
      ) : (
        <FlatListContainer
          data={chapterList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const { uid, ...itemWithoutUid } = item;
            return <CardChapter key={item.id} objeto={itemWithoutUid} />;
          }}
          numColumns={1}
          horizontal={false}
          //   refreshControl={
          //     <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
          //   }
        ></FlatListContainer>
      )}
    </Container>
  );
}

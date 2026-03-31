import { Text } from "react-native";
import { Container, NormalText } from "./styles";
import HeaderAtualization from "../../components/HeaderAtualization";

export default function Atualizar() {
  return (
    
      <Container>

         {/* Header  histórico de leitura */}
              {<HeaderAtualization name={"Atualizar"}>
              
      </HeaderAtualization>}
      

      {/* {chapterList.length === 0 ? (
              <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ color: "gray", fontSize: 16 }}>
                  Nenhum capítulo ainda.
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
            )} */}

      
      </Container>
    
  );
}

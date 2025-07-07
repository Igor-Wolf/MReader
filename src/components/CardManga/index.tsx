import { Image } from "react-native";
import { MangaContainer, MangaContainerText, MangaTitle } from "./styles";
import { CharCount } from "../../utils/caracterCounter";
import { MangaCoverModel } from "../../Models/MangaModel";
import { useNavigation } from "@react-navigation/native";

type CardMangaProps = {
  objeto: MangaCoverModel;
};

export default function CardManga({ objeto }: CardMangaProps) {
  const navigation = useNavigation();
  const handlePress = () => {
      navigation.navigate("MangaDetails", { objeto });
  };

  return (
    <MangaContainer onPress={handlePress}>
      <Image
        source={{ uri: objeto.coverImage }}
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        resizeMode="cover"
      />

      <MangaContainerText>
        <MangaTitle>{CharCount(objeto.slug)}</MangaTitle>
      </MangaContainerText>
    </MangaContainer>
  );
}

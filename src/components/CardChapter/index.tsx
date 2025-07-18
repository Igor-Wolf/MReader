import {
  ImageContainer,
  ImageMangaChapter,
  MangaContainer,
  MangaContainerText,
  MangaTitle,
  RemoveButton,
  TextButton,
} from "./styles";
import { CharCount } from "../../utils/caracterCounter";
import {
  ChapterInfo,
  ChapterInfoDatabase,
  MangaCoverModel,
  ReaderChapters,
} from "../../Models/MangaModel";
import { useNavigation } from "@react-navigation/native";
import { InfoContainer } from "../../views/MangaDetails/styles";
import { DateConvert } from "../../utils/convertDate";
import { deleteChapterByUid } from "../../database/Crud/chapter";
import { useRealm } from "../../context/RealmContext";

type CardChapterProps = {
  objeto: ChapterInfoDatabase;
};

export default function CardChapter({ objeto }: CardChapterProps) {
  const navigation = useNavigation();
  const { realm, isLoading } = useRealm();
  const object = objeto;
  const handlePressMangaDetails = () => {
    const objeto: MangaCoverModel = {
      id: object.idManga,
      slug: object.titleManga,
      coverImage: object.coverImage,
      idFont: object.idFont,
    };
    navigation.navigate("MangaDetails", { objeto });
  };

  const handlePressChapterReader = () => {
    const objeto: ReaderChapters = {
      currentChapter: {
        id: object.id,
        idFont: object.idFont,
        idManga: object.idManga,
        titleManga: object.titleManga,
        coverImage: object.coverImage,
        chapterNumber: object.chapterNumber,
        title: object.title,
      },
      // nextChapter:null,
      // prevChapter: null,
    };
    navigation.navigate("Reader", { objeto });
  };

  const handlePressDeletItem = () => {
    deleteChapterByUid(
      realm,
      `${objeto.idFont}:${objeto.idManga}:${objeto.id}`
    );
  };

  return (
    <MangaContainer onPress={handlePressChapterReader}>
      <ImageContainer onPress={handlePressMangaDetails}>
        <ImageMangaChapter
          source={{ uri: objeto.coverImage }}
          contentFit="cover"
        />
      </ImageContainer>
      <InfoContainer>
        <MangaContainerText>
          <MangaTitle>{CharCount(objeto?.titleManga)}</MangaTitle>
          {objeto.title && <MangaTitle>{CharCount(objeto.title)}</MangaTitle>}
          {objeto.chapterNumber && (
            <MangaTitle>{`Ch. ${CharCount(objeto?.chapterNumber)}`}</MangaTitle>
          )}

          <MangaTitle>{DateConvert(objeto.lastRead.toISOString())}</MangaTitle>
          <RemoveButton onPress={handlePressDeletItem}>
            <TextButton>Remover</TextButton>
          </RemoveButton>
        </MangaContainerText>
      </InfoContainer>
    </MangaContainer>
  );
}

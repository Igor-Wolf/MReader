import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import Carrousel from "../../components/Carrousel/Carrousel";
import { Container } from "./Styles";
import { MangaCoverModel, MangaPage } from "../../Models/MangaModel";
import { GetPagesList } from "./actions";

export default function Reader() {
  const navigation = useNavigation();

  const [imagesManga, setImagesManga] = useState<MangaPage[]>([]);

  const route = useRoute();
  const manga: any = route.params?.objeto;

  const fetchMangaPage = async () => {
    const response = await GetPagesList(manga.idFont, manga.id);
    if (response) {
      setImagesManga(response);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMangaPage();
    };
    load();
  }, []);

  useLayoutEffect(() => {
    const parent = navigation.getParent(); //pegando o tab navigation
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: "black", // cor de fundo da barra inferior
          borderTopColor: "black", // remover borda superior, se quiser
          height: 100, // opcional: altura da barra
        },
      });
    };
  }, [navigation]);

  return (
    <Container>
      <Carrousel list={imagesManga}></Carrousel>
    </Container>
  );
}

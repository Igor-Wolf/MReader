import { Container, FontBox, ScrollContainer, TextFont } from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";

import { MangaFontContext } from "../../context/FontContext";

export default function Navegar() {
  const navigation = useNavigation();
  const [changeScreen, setChangeScreen] = useState(false);
  const { setFont } = useContext(MangaFontContext);

  useEffect(() => {
    if (changeScreen) {
      navigation.navigate("ExtentionManga");
      setChangeScreen(false);
    }
  }, [changeScreen]);

  const handlePressButton = (id: number, name: string) => {
    setFont({
      id: id,
      name: name,
    });
    setChangeScreen(true);
    };
    

  return (
    <ScrollContainer>
      <Container>
        <FontBox onPress={() => handlePressButton(1, "MangaDex")}>
          <TextFont>MangaDex</TextFont>
        </FontBox>
        <FontBox onPress={() => handlePressButton(2, "MangaHere")}>
          <TextFont>MangaHere</TextFont>
        </FontBox>
      </Container>
    </ScrollContainer>
  );
}

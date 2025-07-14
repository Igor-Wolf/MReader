import { Container, FontBox, ScrollContainer, TextFont } from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";

import { MangaFontContext } from "../../context/FontContext";
import {
  FontsConstants,
  FontsConstantsModel,
} from "../../constants/fonts-constants";

export default function Navegar() {
  const navigation = useNavigation();
  const [changeScreen, setChangeScreen] = useState(false);
  const { setFont } = useContext(MangaFontContext);
  const [fontConstant, setFontConstant] = useState<FontsConstantsModel[]>([]);

  useEffect(() => {
    if (changeScreen) {
      navigation.navigate("ExtentionManga");
      setChangeScreen(false);
    }
  }, [changeScreen]);
  useEffect(() => {
    const fonts = FontsConstants();
    setFontConstant(fonts);
  }, []);

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
        {fontConstant.map((item, index) => {
          return (
            <FontBox
              key={index}
              onPress={() => handlePressButton(item.idFont, item.slug)}
            >
              <TextFont>{item.slug}</TextFont>
            </FontBox>
          );
        })}
      </Container>
    </ScrollContainer>
  );
}

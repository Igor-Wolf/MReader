import { Button, Text } from "react-native";
import {
  ConfigButton,
  Container,
  ImageLogo,
  NormalText,
  SubText,
  TitleText,
} from "./Styles";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Home() {
  const navigation = useNavigation();

  return (
    <>
      <Container>
        <TitleText>MReader</TitleText>
        <ImageLogo source={require("../../../assets/logo.png")}></ImageLogo>
        <NormalText>Seja bem-vindo! Boa leitura!</NormalText>
        <SubText>Desenvolvido por IB</SubText>

        <ConfigButton
          onPress={() => {
            navigation.navigate("Sobre");
          }}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </ConfigButton>
      </Container>
    </>
  );
}

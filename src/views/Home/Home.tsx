import { Container, ImageLogo, NormalText, SubText, TitleText } from "./Styles";

export default function Home() {
  return (
    <>
      <Container>
        <TitleText>MReader</TitleText>
        <ImageLogo source={require("../../../assets/logo.png")}></ImageLogo>
        <NormalText>Seja bem-vindo! Boa leitura!</NormalText>
        <SubText>Desenvolvido por IB</SubText>
      </Container>
    </>
  );
}

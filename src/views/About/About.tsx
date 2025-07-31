import {
  ButtonText,
  Container,
  DonwloadButton,
  MainText,
  NormalText,
} from "./styles";
import HeaderAbout from "../../components/HeaderAbout";
import { useNavigation } from "@react-navigation/native";
import { VERSION } from "../../constants/version-constants";
import { VersionApi } from "../../api/VersionAPI";
import { useEffect, useState } from "react";
import { Button, Linking } from "react-native";
import { DateConvert } from "../../utils/convertDate";

export default function About() {
  const navigation = useNavigation();
  const [versionReq, setVersionReq] = useState();
  const [urlReq, setUrlReq] = useState();
  const [dateBuild, setDateBuild] = useState();

  const versionRequest = async () => {
    const response = await VersionApi.get("/latest");

    if (response.status === 200) {
      setVersionReq(response.data.tag_name);
      setUrlReq(response.data.assets[0].browser_download_url);
      setDateBuild(response.data.assets[0].updated_at);
    }
  };

  useEffect(() => {
    versionRequest();
  }, []);

  const openUrl = async () => {
    if (urlReq) {
      await Linking.openURL(urlReq);
    }
  };

  return (
    <>
      <Container>
        <HeaderAbout name={"Sobre"} navigation={navigation}></HeaderAbout>

        <MainText>
          MReader é um aplicativo sem fins lucrativos desenvolvido com a
          finalidade de promover a cultura e o entretenimento.
        </MainText>
        <NormalText>A sua versão é {VERSION}</NormalText>

        {versionReq && (
          <>
            <NormalText>
              A versão mais recente disponível é {versionReq} de{" "}
              {dateBuild && DateConvert(dateBuild)}
            </NormalText>
            <DonwloadButton>
              <ButtonText onPress={openUrl}>Baixar</ButtonText>
            </DonwloadButton>
          </>
        )}
      </Container>
    </>
  );
}

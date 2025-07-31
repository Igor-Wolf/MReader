import { CharCount } from "../../utils/caracterCounter";
import { BackButton, HeaderBox, HeaderTitle, TopBox } from "./styles";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function HeaderAbout({ name, navigation }: any) {
  const handlePressBackButton = () => {
    navigation.goBack();
  };

  return (
    <>
      <HeaderBox>
        <TopBox>
          <BackButton onPress={handlePressBackButton}>
            <Ionicons name="arrow-back" size={30} color="gray" />
          </BackButton>
          <HeaderTitle>{CharCount(name)}</HeaderTitle>
        </TopBox>
      </HeaderBox>
    </>
  );
}

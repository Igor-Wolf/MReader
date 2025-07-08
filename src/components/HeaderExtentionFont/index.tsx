import { useState } from "react";
import { CharCount } from "../../utils/caracterCounter";
import {
  BackButton,
  BottomBox,
  BoxSearch,
  Button,
  ButtonSearch,
  ButtonText,
  HeaderBox,
  HeaderTitle,
  InputBox,
  RemoveSearch,
  TopBox,
} from "./styles";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function HeaderExtention({
  name,
  navigation,
  refreshNew,
  refreshPopular,
  refreshSearch,
  setInputText,
}: any) {
  const [isSearching, setIsSearching] = useState(false);

  const handlePressBackButton = () => {
    navigation.goBack();
  };

  const onPressPopular = () => {
    refreshPopular();
  };
  const onPressNew = () => {
    refreshNew();
  };

  const onPressSearch = () => {
    refreshSearch();
  };

  const handlePressSearchButton = () => {
    setIsSearching(true);
  };
  const handlePressRemoveSearch = () => {
    setIsSearching(false);
  };

  return (
    <>
      <HeaderBox>
        <TopBox>
          <BackButton onPress={handlePressBackButton}>
            <Ionicons name="arrow-back" size={30} color="gray" />
          </BackButton>
          {!isSearching && <HeaderTitle>{CharCount(name)}</HeaderTitle>}
          {isSearching && (
            <BoxSearch>
              <InputBox
                placeholder="Buscar..."
                returnKeyType="search" // Mostra a lupa ou "Buscar" no botão de retorno
                keyboardType="default" // Ou 'web-search' (em Android)
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setInputText}
                onSubmitEditing={(e) => {
                  onPressSearch();
                }}
              ></InputBox>
              <RemoveSearch onPress={handlePressRemoveSearch}>
                <Ionicons name="close" size={24} color="white" />
              </RemoveSearch>
            </BoxSearch>
          )}
        </TopBox>

        <BottomBox>
          <Button onPress={onPressPopular}>
            <Ionicons name="heart" size={20} color="gray" />
            <ButtonText>Favoritos</ButtonText>
          </Button>
          <Button onPress={onPressNew}>
            <Ionicons name="alert" size={20} color="gray" />
            <ButtonText>Novidade</ButtonText>
          </Button>
        </BottomBox>
      </HeaderBox>
      <ButtonSearch onPress={handlePressSearchButton}>
        <Ionicons name="search" size={40} color="white" />
      </ButtonSearch>
    </>
  );
}

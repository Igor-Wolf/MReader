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
  setFilter,
  
}: any) {
  const [isSearching, setIsSearching] = useState(false);
    const [imputText, setInputText] = useState("")


  const onPressSearch = () => {
    setFilter(imputText);
  };

  const handlePressSearchButton = () => {
    setIsSearching(true);
  };
  const handlePressRemoveSearch = () => {
    setIsSearching(false);
    setFilter("")
  };

  return (
    <>
      <HeaderBox>
        <TopBox>
          {!isSearching && <HeaderTitle>{CharCount(name)}</HeaderTitle>}
          {isSearching && (
            <BoxSearch>
              <InputBox
                placeholder="Buscar..."
                placeholderTextColor="black"
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
      </HeaderBox>
      <ButtonSearch onPress={handlePressSearchButton}>
        <Ionicons name="search" size={40} color="white" />
      </ButtonSearch>
    </>
  );
}

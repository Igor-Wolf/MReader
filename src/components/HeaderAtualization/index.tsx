import { useState } from "react";
import { CharCount } from "../../utils/caracterCounter";
import { HeaderBox, HeaderTitle, RemoveAllButton, TopBox } from "./styles";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function HeaderAtualization({ name }: any) {
  const [isSearching, setIsSearching] = useState(false);

  const handlePress = () => {
    alert("clicou");
  };

  return (
    <>
      <HeaderBox>
        <TopBox>
          {!isSearching && <HeaderTitle>{CharCount(name)}</HeaderTitle>}
          <RemoveAllButton onPress={handlePress}>
            <Ionicons name="sync-circle-outline" size={24} color="white" />
          </RemoveAllButton>
        </TopBox>
      </HeaderBox>
    </>
  );
}

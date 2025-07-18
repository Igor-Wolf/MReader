import { useState } from "react";
import { CharCount } from "../../utils/caracterCounter";
import { HeaderBox, HeaderTitle, RemoveAllButton, TopBox } from "./styles";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRealm } from "../../context/RealmContext";
import { deleteAllChapters } from "../../database/Crud/chapter";

export default function HeaderHistory({ name }: any) {
  const [isSearching, setIsSearching] = useState(false);
  const { realm, isLoading } = useRealm();

  const handlePress = () => {

    deleteAllChapters(realm)
  };

  return (
    <>
      <HeaderBox>
        <TopBox>
          {!isSearching && <HeaderTitle>{CharCount(name)}</HeaderTitle>}
          <RemoveAllButton onPress={handlePress}>
            <Ionicons name="trash-outline" size={24} color="white" />
          </RemoveAllButton>
        </TopBox>
      </HeaderBox>
    </>
  );
}

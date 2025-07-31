import { useEffect, useState } from "react";
import { useRealm } from "../../context/RealmContext";
import { Container, ContainerColor } from "./styled";
import { getReadChapter } from "../../database/Crud/readChapter"; 

export default function ChapterPopup({ idFont, idManga, idChap }) {
  const { realm, isLoading } = useRealm();

  
  const [chapterExists, setChapterExists] = useState(false);

  useEffect(() => {
   
    if (!realm || isLoading || idFont === undefined || !idManga || !idChap) {
      setChapterExists(false); 
      return;
    }

    let chapterQueryResult;
    try {
      
      chapterQueryResult = getReadChapter(
        realm,
        idFont,
        String(idManga),
        String(idChap)
      );
    } catch (error) {
     
      console.error("Erro ao obter capítulo do Realm para listener:", error);
      setChapterExists(false); 
      return;
    }

    
    const updateChapterStatus = () => {
      
      if (chapterQueryResult && typeof chapterQueryResult.length === "number") {
       
        setChapterExists(chapterQueryResult.length > 0);
      } else {
       
        setChapterExists(false);
      }
    };

    
    updateChapterStatus();
    
    if (
      chapterQueryResult &&
      typeof chapterQueryResult.addListener === "function"
    ) {
      chapterQueryResult.addListener(updateChapterStatus);
    }

    
    return () => {
      if (
        chapterQueryResult &&
        typeof chapterQueryResult.removeListener === "function"
      ) {
        chapterQueryResult.removeListener(updateChapterStatus);
      }
    };
  }, [realm, isLoading, idFont, idManga, idChap]); 

  
  return <Container>{!chapterExists && <ContainerColor />}</Container>;
}

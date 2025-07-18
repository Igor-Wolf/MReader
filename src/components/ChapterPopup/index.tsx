import { useEffect, useState } from "react";
import { useRealm } from "../../context/RealmContext";
import { Container, ContainerColor } from "./styled";
import { getChapter } from "../../database/Crud/chapter"; // Sua função getChapter, que agora retorna Realm.Results

export default function ChapterPopup({ idFont, idManga, idChap }) {
  const { realm, isLoading } = useRealm();

  // O estado indica se o capítulo *existe* no DB.
  // Começamos como 'false' ou 'true' dependendo do seu comportamento padrão antes da verificação.
  // É mais seguro assumir 'false' até que a consulta seja feita.
  const [chapterExists, setChapterExists] = useState(false);

  useEffect(() => {
    // 1. Verifique se o Realm e os dados essenciais estão prontos.
    // Se algo estiver faltando, não podemos fazer a consulta ou observar.
    if (!realm || isLoading || idFont === undefined || !idManga || !idChap) {
      setChapterExists(false); // Assume que não existe ou não pode ser verificado
      return;
    }

    let chapterQueryResult;
    try {
      // 2. Obtém a coleção de resultados para o capítulo específico.
      // Esta coleção é "viva" e será atualizada automaticamente pelo Realm.
      chapterQueryResult = getChapter(realm, idFont, String(idManga), String(idChap));
    } catch (error) {
      // Captura qualquer erro na consulta inicial ao Realm (ex: schema inválido).
      console.error("Erro ao obter capítulo do Realm para listener:", error);
      setChapterExists(false); // Em caso de erro, assume que não existe
      return;
    }

    // 3. Define a função de callback para o listener.
    // Esta função será chamada sempre que a coleção 'chapterQueryResult' mudar.
    const updateChapterStatus = () => {
      // Verifica se a coleção não é nula/indefinida e se tem a propriedade 'length'.
      // Realm.Results sempre terá 'length'.
      if (chapterQueryResult && typeof chapterQueryResult.length === "number") {
        // Se o comprimento for maior que 0, significa que o capítulo existe.
        setChapterExists(chapterQueryResult.length > 0);
      } else {
        // Caso inesperado (ex: chapterQueryResult não é uma Results válida), assume que não existe.
        setChapterExists(false);
      }
    };

    // 4. Chama a função de status uma vez imediatamente para definir o estado inicial.
    updateChapterStatus();

    // 5. Adiciona o listener à coleção de resultados.
    // Isso fará com que 'updateChapterStatus' seja chamada automaticamente
    // sempre que o estado de existência do capítulo mudar no DB.
    if (
      chapterQueryResult &&
      typeof chapterQueryResult.addListener === "function"
    ) {
      chapterQueryResult.addListener(updateChapterStatus);
    }

    // 6. Retorna uma função de limpeza para remover o listener quando o componente for desmontado
    // ou quando as dependências do useEffect mudarem.
    return () => {
      if (
        chapterQueryResult &&
        typeof chapterQueryResult.removeListener === "function"
      ) {
        chapterQueryResult.removeListener(updateChapterStatus);
      }
    };
  }, [realm, isLoading, idFont, idManga, idChap]); // Dependências do useEffect

  // Renderiza o ContainerColor APENAS SE o capítulo *NÃO* existir (chapterExists for false).
  return <Container>{!chapterExists && <ContainerColor />}</Container>;
}

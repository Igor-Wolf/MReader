import React, { useState, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { DownloadContainer, DownloadPress } from "./styles";
import { Alert, Text, ActivityIndicator } from "react-native";
import {
  downloadChapter,
  deleteChapterFiles,
} from "../../services/DownloadService";
import {
  createDownloadChapter,
  deleteDownloadChapterByUid,
  getDownloadChapter,
} from "../../database/Crud/downloadChapter";
import { MangaChapterModel } from "../../Models/MangaModel";
import { useRealm } from "../../context/RealmContext";

interface DownloadButtonProps {
  fontID: number;
  mangaID: string;
  chapterID: string;
  chapterAll: MangaChapterModel;
  isDownloaded?: boolean;
}

export default function DownloadButton({
  fontID,
  mangaID,
  chapterID,
  chapterAll,
  isDownloaded = false,
}: DownloadButtonProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [localDownloaded, setLocalDownloaded] = useState<boolean>(isDownloaded);
  const [checkingDatabase, setCheckingDatabase] = useState<boolean>(true); // Estado para evitar flickering visual
  const { realm } = useRealm();

  const uid = `${fontID}:${mangaID}:${chapterID}`;

  // 🔍 VERIFICAÇÃO AO MONTAR O COMPONENTE
  useEffect(() => {
    if (!realm) {
      setCheckingDatabase(false);
      return;
    }

    try {
      // Consulta se o registro exato já existe no Realm
      const downloadedRecord = getDownloadChapter(
        realm,
        fontID,
        mangaID,
        chapterID,
      );

      if (downloadedRecord && downloadedRecord.length > 0) {
        setLocalDownloaded(true);
      } else {
        setLocalDownloaded(false);
      }
    } catch (error) {
      console.error("Erro ao checar status de download no Realm:", error);
    } finally {
      setCheckingDatabase(false);
    }
  }, [realm, fontID, mangaID, chapterID]);

  // 🔽 FUNÇÃO PARA BAIXAR
  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setProgress(0);

    const resultado = await downloadChapter({
      fontID,
      mangaId: mangaID,
      chapterId: chapterID,
      onProgress: (p) => setProgress(p),
    });

    setIsDownloading(false);

    if (resultado) {
      setLocalDownloaded(true);
      try {
        await createDownloadChapter(realm, {
          idChap: chapterAll.id,
          idFont: fontID,
          idManga: mangaID,
          title: chapterAll.title,
          chapterNumber: chapterAll.chapter,
          scanName: chapterAll.scanName,
          volume: chapterAll.volume,
          date: chapterAll.date,
        });
        Alert.alert("Sucesso", "Capítulo baixado com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar no Realm:", error);
        Alert.alert(
          "Erro",
          "O arquivo foi baixado, mas falhou ao registrar no banco.",
        );
      }
    } else {
      setProgress(0);
      Alert.alert("Erro", "Houve uma falha ao baixar o capítulo.");
    }
  };

  // 🗑️ FUNÇÃO PARA REMOVER O CAPÍTULO
  const handleDelete = () => {
    Alert.alert(
      "Remover Capítulo",
      "Tem certeza que deseja deletar este capítulo do armazenamento local?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              if (deleteChapterFiles) {
                await deleteChapterFiles({
                  fontID,
                  mangaId: mangaID,
                  chapterId: chapterID,
                });
              }

              const sucessfullyDeleted = deleteDownloadChapterByUid(realm, uid);

              if (sucessfullyDeleted) {
                setLocalDownloaded(false);
                setProgress(0);
                Alert.alert("Sucesso", "Capítulo removido do dispositivo.");
              }
            } catch (error) {
              console.error("Erro ao deletar capítulo:", error);
              Alert.alert("Erro", "Falha ao apagar os arquivos locais.");
            }
          },
        },
      ],
    );
  };

  // Enquanto estiver lendo o banco do Realm na montagem, renderiza um indicador neutro
  if (checkingDatabase) {
    return (
      <DownloadContainer>
        <ActivityIndicator size="small" color="#FFF" />
      </DownloadContainer>
    );
  }

  return (
    <DownloadContainer>
      {localDownloaded ? (
        // 🔴 Se JÁ ESTIVER BAIXADO: Mostra exclusivamente o botão de Lixeira/Deletar
        <DownloadPress
          onPress={handleDelete}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            borderColor: "tomato",
          })}
        >
          <Feather name="trash-2" size={20} color="tomato" />
        </DownloadPress>
      ) : (
        // ⚪ Se NÃO ESTIVER BAIXADO: Mostra exclusivamente o botão de Download / Loader
        <DownloadPress
          onPress={handleDownload}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            transform: [
              // 🚀 Se estiver baixando, move o elemento 10 pixels para cima. Se não, fica na posição original (0).
              { translateY: isDownloading ? -10 : 0 },
            ],
          })}
          disabled={isDownloading}
        >
          <Feather
            name={isDownloading ? "loader" : "download"}
            size={22}
            color="#FFF"
          />
          {isDownloading && (
            <Text
              style={{
                color: "tomato",
                fontSize: 10,
                marginTop: 4,
                fontWeight: "bold",
                position: "absolute",
                bottom: -18,
              }}
            >
              {Math.round(progress * 100)}%
            </Text>
          )}
        </DownloadPress>
      )}
    </DownloadContainer>
  );
}

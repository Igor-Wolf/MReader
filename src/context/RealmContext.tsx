import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import { MangaSchema } from '../database/schemas/MangaSchema';
import { ChapterSchema } from '../database/schemas/ChapterSchema';
import { ReadChapterSchema } from '../database/schemas/ReadChapterSchema'; 

type RealmContextType = {
  realm: Realm | null;
  isLoading: boolean;
};

const RealmContext = createContext<RealmContextType>({
  realm: null,
  isLoading: true,
});

const SHOULD_DELETE_REALM = false; // Mude para true para deletar antes de abrir

export const RealmProvider = ({ children }: { children: React.ReactNode }) => {
  const [realm, setRealm] = useState<Realm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let realmInstance: Realm | null = null;

    async function setupRealm() {
      if (SHOULD_DELETE_REALM) {
        await Realm.deleteFile({ path: 'manga-app.realm' });
        console.log('Realm deletado antes de abrir.');
      }

      realmInstance = await Realm.open({
        path: 'manga-app.realm',
        schema: [MangaSchema, ChapterSchema, ReadChapterSchema ],
        schemaVersion: 2, // Lembre-se de atualizar ao mudar schemas
        migration: (oldRealm, newRealm) => {
          if (oldRealm.schemaVersion < 2) {
            // lógica de migração, se precisar
          }
        },
      });

      setRealm(realmInstance);
      setIsLoading(false);
    }

    setupRealm();

    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.close();
      }
    };
  }, []);

  return (
    <RealmContext.Provider value={{ realm, isLoading }}>
      {children}
    </RealmContext.Provider>
  );
};

export const useRealm = () => useContext(RealmContext);

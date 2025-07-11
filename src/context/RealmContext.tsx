import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import { MangaSchema } from '../database/schemas/MangaSchema';
import { ChapterSchema } from '../database/schemas/ChapterSchema';

type RealmContextType = {
  realm: Realm | null;
  isLoading: boolean;
};

const RealmContext = createContext<RealmContextType>({
  realm: null,
  isLoading: true,
});

export const RealmProvider = ({ children }: { children: React.ReactNode }) => {
  const [realm, setRealm] = useState<Realm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Realm.open({
      path: 'manga-app.realm',
      schema: [MangaSchema, ChapterSchema],
    }).then(r => {
      setRealm(r);
      setIsLoading(false);
    });

    return () => {
      if (realm && !realm.isClosed) {
        realm.close();
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

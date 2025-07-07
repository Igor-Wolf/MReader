// Tipo do objeto

import { createContext, useState } from "react";

export interface MangaFont {
  id: number;
  name: string;
}

// Tipo do contexto

interface MangaFontContextType {
  font: MangaFont;
  setFont: (font: MangaFont) => void;
}

// Criando contexto

export const MangaFontContext = createContext<MangaFontContextType>({
  font: { id: 0, name: "" },
  setFont: () => {},
});

// Provedor que envolve a aplicação

export const MangaFontProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [font, setFont] = useState<MangaFont>({
    id: 0,
    name: "",
  });

  return (
    <MangaFontContext.Provider value={{ font, setFont }}>
      {children}
    </MangaFontContext.Provider>
  );
};

export interface FontsConstantsModel {
  idFont: number;
  slug: string;
}

export const FontsConstants = (): FontsConstantsModel[] => {
  const fontList: FontsConstantsModel[] = [
    {
      idFont: 1,
      slug: "MangaDex",
    },
    {
      idFont: 2,
      slug: "HqNow",
    },
  ];

  return fontList;
};

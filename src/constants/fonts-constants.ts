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
    {
      idFont: 3,
      slug: "NineManga *",
    },
    {
      idFont: 4,
      slug: "Mangaflix",
    },
    {
      idFont: 5,
      slug: "Niadd *",
    },
    {
      idFont: 6,
      slug: "NovelCool *",
    },
  ];

  return fontList;
};

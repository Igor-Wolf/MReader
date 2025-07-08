export const CharCount = (char: string) => {
  if (char && char.length > 35) {
    return `${char.slice(0, 35)}...`;
  }
  return char;
};

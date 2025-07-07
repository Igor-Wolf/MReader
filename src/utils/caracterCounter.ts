export const CharCount = (char: string) => {
  if (char && char.length > 20) {
    let part = char.match(/.{1,20}/g);    
    return `${part}...`;
  } else {
    return char;
  }
};

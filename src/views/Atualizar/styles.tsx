import styled from "styled-components";
import { Image } from "expo-image";
import { Picker } from "@react-native-picker/picker";



export const NormalText = styled.Text`
  color: gray;
  font-size: 16px;
`;



export const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: black;
  padding-top: 120px;
  justify-content: flex-start;
`;





export const ImageMangaChapter = styled(Image)`
  height:100%;
  aspect-ratio: 1;
  border-radius: 3px;
  padding: 5px;
  elevation: 5;
`;



export const ChapterBoxExternal = styled.Pressable`
  width: 100%;
  flex-direction: row;
  height: 75px;
  padding: 5px;
  align-items: center;
`;
export const ChapterBox = styled.Pressable`
  flex: 1;
  min-width: 0;
  height: 100%;
  justify-content: space-between;
  padding-left: 5px;
  overflow: hidden;
`;

export const ChapterTopBox = styled.View`
  width: 100%;
  flex-direction: row;
  overflow: hidden;
  padding-right: 5px;
`;
export const ChapterBottomBox = styled.View`
  width: 100%;
  flex-direction: row;
  margin-bottom: 5px;
  padding-bottom: 5px;
  padding-right: 5px;

  overflow: hidden;
`;

export const ChapterTextTop = styled.Text`
  color: white;
  padding-right: 5px;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
`;
export const ChapterTextBottom = styled.Text`
  color: gray;
  padding-right: 10px;
`;



export const MangaContainer = styled.Pressable`


`



export const TopContainer = styled.View`
  
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

`

export const TopText = styled.Text`
  
  color: white;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 5px;
  font-size: 20px;
  font-weight: 600;

  
`;



export const StyledPicker = styled(Picker)`
  height: 30px;
  width: 50px;
  background-color: black;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: white;
`;



export const OrderChapterBox=styled.View`
  
  flex-direction: row;
  align-items: center;

`

export const TextOrderChapterBox = styled.Text`
  
  color: tomato;
  margin-right: -15px;
  z-index: 4;
  font-size: 16px;


`;



export const DividerText = styled.Text`
  color: gray;
  font-size: 14px;
  font-weight: bold;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 5px;
`;


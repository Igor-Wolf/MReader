import styled from "styled-components";
import { Image as ExpoImage } from "expo-image";
import { Picker } from "@react-native-picker/picker";

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: black;
  height: 100%;
  padding-bottom: 120px;
`;

export const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: black;
  padding: 0px;
  padding-top: 120px;

  height: 100%;

  justify-content: flex-start;
`;

export const TopContainer = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 5px;
`;

export const InfoContainer = styled.View`
  flex: 1;
  padding: 10px;

  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  justify-content: space-evenly;
`;

export const ImageManga = styled(ExpoImage)`
  width: 40%;
  height: 250px;
  border-radius: 8px;
`;

export const TitleManga = styled.Text`
  font-size: 20px;
  color: white;
  font-weight: 600;
  width: 100%;
`;

export const MidleContainer = styled.View`
  flex: 1;
  padding: 5px;
  padding-top: 15px;
`;

export const NormalText = styled.Text`
  color: gray;
  font-size: 17px;
  font-weight: 600;
  line-height: 32px;
`;
export const NormalTextTop = styled.Text`
  color: white;
  font-size: 19px;
  font-weight: 600;
  line-height: 32px;
  width: 100%;
`;

export const TagsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const TagsBox = styled.View`
  border-color: gray;
  border-radius: 10px;
  border-width: 1px;
  padding: 5px;
  margin: 5px;
`;

export const ChapterBox = styled.Pressable`
  width: 100%;

  height: 75px;
  justify-content: space-between;
  padding: 5px;
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
`;
export const ChapterTextBottom = styled.Text`
  color: gray;
  padding-right: 10px;
`;

export const ButtonsSetings = styled.View`
  width: 100%;
`;

export const NewLangBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledPicker = styled(Picker)`
  height: 30px;
  width: 50px;
  background-color: black;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: white;
`;

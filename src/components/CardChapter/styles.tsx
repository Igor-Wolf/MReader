import styled from "styled-components";
import { Image } from "expo-image";

export const MangaContainer = styled.Pressable`
  height: 180px;
  width: 100%;
  padding: 10px;
  border-width: 1px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 5px;
  elevation: 50;
  margin-bottom:10px;
  
`;

export const ImageMangaChapter = styled(Image)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
`;

export const ImageContainer = styled.Pressable`
  width: 30%;
  aspect-ratio: 1;
  border-radius: 8px;
`;

export const MangaTitle = styled.Text`
  font-size: 16px;
  overflow: hidden;
  width: 100%;
  color: white;
  font-weight: 600;
  padding: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  elevation: 50;
`;

export const MangaContainerText = styled.View`
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  justify-content: center;
  border-radius: 5px;
  flex: 1;
  
`;

export const InfoContainerText = styled.View`
  width: 70%;
  height: 100%;
`;

export const RemoveButton = styled.Pressable`
  height: 30px;
  width: 90%;
  background-color: tomato;
  border-width: 1px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  align-self: center;
  border-color: white;
  elevation: 50;
`;

export const TextButton = styled.Text`
  color: white;
  font-weight: 600;
`;

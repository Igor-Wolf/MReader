import styled from "styled-components";

export const ImageCarousel = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ImageContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const PageIndicatorBox = styled.View`
  width: 100%;
  z-index: 10;
  position: absolute;
  bottom: 50px;
  align-items: center;
`;

export const PageIndicatorText = styled.Text`
  color: white;
  font-weight: 600;
`;

export const ChapterTopBox = styled.View`
  width: 100%;
  height:120px;
  z-index: 10;
  position: absolute;
  top: 0px;
  align-items: center;
  padding-top: 15px; 
  padding-bottom: 15px; 
  border-bottom-width: 1px;
  border-color: gray;
  background-color: black;
  justify-content: flex-end;
`;

export const TitleText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

export const AuxiPage = styled.View`
  background-color: black;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const Indicator = styled.View`
  position: absolute;
  bottom: 50%;
  top: 50%;
  left: 50%;
  right: 50%;
  z-index: 5;
`;

export const ChapterIndicator = styled.View`
  height: 100px;
  width: 70%;
  border-width: 1px;
  border-color: gray;
  border-radius: 10px;
  padding: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 50px;
`;

export const ButtonNextPrevChapter = styled.Pressable`
  height: 60px;
  width: 200px;
  background-color: tomato;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border-color: white;
  border-width: 1px;
  elevation: 100;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  margin-right: 20px;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  left: 20px;
`;




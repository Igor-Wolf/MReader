import styled from "styled-components/native";

export const ImageCarousel = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ImageContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
`;

export const PageIndicatorBox = styled.View`
  width: 100%;
  z-index: 10;
  position: absolute;
  bottom: 50px; /* Voltando para o seu padrão original seguro */
  align-items: center;
`;

export const PageIndicatorText = styled.Text`
  color: white;
  font-weight: 600;
`;

export const ChapterTopBox = styled.View`
  width: 100%;
  height: 120px;
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

/* ==========================================================================
   COMPONENTES DOS FILTROS E DA ENGRENAGEM
   ========================================================================== */

export const FilterOverlay = styled.View<{ color: string; opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.color};
  opacity: ${(props) => props.opacity};
  pointer-events: none;
`;

// Novo botão flutuante da engrenagem (fica no canto inferior direito)
export const GearButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 40px;
  right: 25px;
  width: 45px;
  height: 45px;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  z-index: 12;
  border-width: 1px;
  border-color: #444;
`;

export const SettingsModal = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(15, 15, 15, 0.98);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  padding-bottom: 35px;
  align-items: center;
  z-index: 15; /* zIndex maior para cobrir o indicador se aberto */
  border-top-width: 1px;
  border-color: #333;
`;

export const SliderLabelBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-horizontal: 5px;
  margin-bottom: 5px;
`;

export const SliderLabel = styled.Text`
  color: #aaa;
  font-size: 14px;
  font-weight: 600;
`;

export const SliderRow = styled.View`
  width: 100%;
  margin-top: 15px;
`;

export const ButtonFilterGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

export const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "rgba(255, 255, 255, 0.15)" : "#1c1c1e")};
  border-width: 1px;
  border-color: ${(props) => (props.active ? "tomato" : "#333")};
  padding-vertical: 12px;
  border-radius: 8px;
  flex: 1;
  margin-horizontal: 5px;
  align-items: center;
  justify-content: center;
`;



export const WebtoonScrollView = styled.ScrollView`
  flex: 1;
  background-color: black;
  width: 100%;
`;



export const ModeButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
  border-top-width: 1px;
  border-color: #222;
  padding-top: 15px;
`;

// Container individual com tamanho fixo e estrito para ajudar o algoritmo da lista
export const WebtoonImageWrapper = styled.View<{ windowHeight: number }>`
  width: 100%;
  height: ${(props) => props.windowHeight}px;
  position: relative;
  background-color: black;
`;
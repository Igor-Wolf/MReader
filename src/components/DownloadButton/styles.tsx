import styled from "styled-components/native";

// O Container passa a ser o responsável pelo posicionamento absoluto na linha do capítulo
export const DownloadContainer = styled.View`
  position: absolute;
  right: 15px;
  top: 25%;
  z-index: 20;
  align-items: center;
  justify-content: center;
`;

export const DownloadPress = styled.Pressable`
  width: 40px;
  height: 40px;
  background-color: #131212;
  border-radius: 20px; /* Círculo perfeito */
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  
  /* REMOVIDO: A opacidade quebrada que ficava aqui */
`;
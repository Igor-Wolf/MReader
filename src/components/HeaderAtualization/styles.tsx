
import styled from "styled-components/native";
import { Animated } from "react-native";

export const HeaderBox = styled.View`
  flex-direction: column;
  width: 100%;
  background-color: black;
  min-height: 120px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-color: gray;
  padding: 20px;
  padding-bottom: 16px;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

export const HeaderTitle = styled.Text`
  color: tomato;
  font-weight: 600;
  font-size: 20px;
  flex-shrink: 1;
`;

export const TopBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UpdateButton = styled.Pressable`
  align-items: center;
  justify-content: center;
  padding: 4px;
`;

export const ProgressContainer = styled.View`
  width: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
  padding-horizontal: 12px;
  padding-top: 14px;
`;

export const ProgressRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ProgressIcon = styled.View`
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const ProgressBarBackground = styled.View`
  flex: 1;
  height: 7px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
`;

export const ProgressBarFill = styled(Animated.View)`
  height: 100%;
  background-color: #4ade80;
  border-radius: 10px;
`;

export const ProgressPercentage = styled.Text`
  color: #4ade80;
  font-size: 12px;
  font-weight: bold;
  min-width: 42px;
  text-align: right;
  margin-left: 10px;
`;

export const ProgressCounter = styled.Text`
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  margin-top: 8px;
  text-align: center;
`;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SwipeToRefresh() {
  const translateX = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      translateX.value = withTiming(0);
    }, 100);
  };

  const gestureHandler = useAnimatedGestureHandler({
      onActive: (event) => {
          
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    },
      onEnd: (event) => {
        console.log("pan")
      if (event.translationX < -100) {
        runOnJS(refresh)();
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedStyle]}>
          {refreshing ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text>Deslize da direita para a esquerda para atualizar</Text>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        width: '100%',
        height:"100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  card: {
    width: '100%',
        height:"100%",
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
});

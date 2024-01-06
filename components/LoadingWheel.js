import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

export default function LoadingWheel() {

  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setAngle(prev => prev+5), 10);
    return () => clearInterval(interval);
  },[]);

  return (
    <View style={styles.container}>
      <View style={{...styles.loadingWheel, transform: [{ translateX: -50}, {translateY: -50}, { rotate: `${angle}deg` }]}}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
    position: "absolute",
  },
  loadingWheel: {
    position: "absolute",
    top: '50%',
    left: '50%',  
    zIndex: 1,
    width: 100,
    height: 100,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderRadius: 50,
    borderColor: '#BA99FE',
  },
});
import React from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CustomText } from "./CustomText";
import GradientFontColor from "./GradientFontColor";

import FontAwesome from "react-native-vector-icons/FontAwesome";

const SignModal = ({ onClose, onSignIn, onSignUp, closeSignModal }) => {

  return (
    <View style={styles.container}>
      <View>
        <GradientFontColor style={styles.title}>Welcome !</GradientFontColor>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={closeSignModal}>
        <FontAwesome name="close" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <CustomText style={{ fontSize: 18 }}>
          Already have an account ?
        </CustomText>
        <TouchableOpacity style={styles.button} onPress={onSignIn}>
          <CustomText style={styles.buttonText}>Sign In</CustomText>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <CustomText style={{ fontSize: 18 }}>
            Don't have an account ?
          </CustomText>
          <TouchableOpacity style={styles.button} onPress={onSignUp}>
            <CustomText style={styles.buttonText}>Sign Up</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "KronaOne_400Regular",
    marginTop: 50,
    marginBottom: 30,
  },
  buttonContainer: {
    flex: 1,
    marginVertical: 20,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#3972D9",
    borderRadius: 25,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#3972D9",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    width: 40,
    height: 40,
    right: 10,
    top: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignModal;

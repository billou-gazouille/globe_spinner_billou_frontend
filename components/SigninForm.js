import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import GradienFontColor from "../components/GradientFontColor";

export default function SigninForm({ submit, closeModal }) {

  const checkHasEmptyField = (fields) => {
    for (let field of fields) {
      if (!field || field === " ") return true;
    }
    return false;
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePressSubmit = async () => {
    if (checkHasEmptyField([email, password])) {
      Alert.alert("Some fields are missing!");
      return;
    }
    const response = await submit(email, password);
    if (!response.result) {
      return Alert.alert(response.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        enabled={true}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <FontAwesome name="close" size={30} />
        </TouchableOpacity>

        <View style={styles.title}>
          <GradienFontColor>
            <Text style={styles.signInText}>Sign in</Text>
          </GradienFontColor>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.textAndInput}>
            <FontAwesome name="user" size={30} color="#BA99FE" />
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="email"
                style={styles.textInput}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
          </View>

          <View style={styles.textAndInput}>
            <FontAwesome name="lock" size={30} color="#BA99FE" />
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="password"
                style={styles.textInput}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
              ></TextInput>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.submitButton} onPress={handlePressSubmit}>
        <Text style={{ fontSize: 25, color: "white" }}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    flex: 1,
  },

  closeButton: {
    width: 40,
    height: 40,
    right: -15,
    top: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: {
    width: "80%",
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textAndInput: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  textInputContainer: {
    fontSize: 16,
    borderBottomColor: "#BA99FE",
    borderBottomWidth: 2,
    paddingVertical: 5,
    marginTop: 10,
    marginLeft: 15,
    flexDirection: "row",
  },

  title: {
    alignItems: "center",
    marginBottom: 80,
    marginTop: 50,
  },

  textInput: {
    width: "100%",
    borderWidth: 0,
    fontSize: 15,
    padding: 5,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: "NunitoSans_400Regular",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#3972D9",
    borderRadius: 25,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  signInText: {
    fontSize: 30,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "KronaOne_400Regular",
    marginTop: 50,
    marginBottom: 30,
  },
});

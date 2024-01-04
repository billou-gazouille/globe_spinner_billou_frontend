import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import GradientFontColor from "./GradientFontColor";
import { CustomText } from "./CustomText";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Header } from "@react-navigation/elements";

export default function SignupForm({ submit, closeModal }) {
  const { width } = useWindowDimensions();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const [showFieldsError, setShowFieldsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const checkHasEmptyField = (fields) => {
    for (let field of fields) {
      if (!field || field === " ") return true;
    }
    return false;
  };

  const handlePressSubmit = async () => {
    if (
      checkHasEmptyField([
        firstname,
        lastname,
        email,
        password,
        confirmPassword,
      ])
    ) {
      return Alert.alert("Some fields are missing!");
    }
    if (!EMAIL_REGEX.test(email)) {
      return Alert.alert("Wrong email address format");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Passwords don't match!");
    }
    if (password.length < 5) {
      return Alert.alert("Password must be at least 5 characters long!");
    }
    const response = await submit(firstname, lastname, email, password);
    //console.log(response);
    if (!response.result) {
      return Alert.alert(response.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollView, { width: width }]}>
        <StatusBar style="auto" />
        <View>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <GradientFontColor style={styles.title}>Sign</GradientFontColor>
          <Text style={styles.titleUp}>up</Text>
        </View>

        <KeyboardAvoidingView
          enabled={true}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[{ width: width }]}
        >
          <View style={styles.inputsContainerRow}>
            <View style={styles.textAndInput}>
              <CustomText style={{ fontSize: 20, color: "black" }}>
                first name
              </CustomText>
              <TextInput
                placeholder="firstname"
                style={styles.textInput}
                value={firstname}
                onChangeText={(text) => setFirstname(text)}
                autoFocus={true}
              ></TextInput>
            </View>

            <View style={styles.textAndInput}>
              <CustomText style={{ fontSize: 20, color: "black" }}>
                last name
              </CustomText>
              <TextInput
                placeholder="lastname"
                style={styles.textInput}
                value={lastname}
                onChangeText={(text) => setLastname(text)}
              ></TextInput>
            </View>

            <View style={styles.textAndInput}>
              <CustomText style={{ fontSize: 20, color: "black" }}>
                e-mail
              </CustomText>
              <TextInput
                placeholder="e-mail"
                style={styles.textInput}
                value={email}
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
            </View>

            <View style={styles.textAndInput}>
              <CustomText style={{ fontSize: 20, color: "black" }}>
                password
              </CustomText>
              <TextInput
                placeholder="password"
                secureTextEntry={true}
                style={styles.textInput}
                value={password}
                onChangeText={(text) => setPassword(text)}
              ></TextInput>
            </View>

            <View style={styles.textAndInput}>
              <CustomText style={{ fontSize: 20, color: "black" }}>
                confirm password
              </CustomText>
              <TextInput
                placeholder="confirm password"
                secureTextEntry={true}
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              ></TextInput>
            </View>
          </View>
        </KeyboardAvoidingView>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePressSubmit}
        >
          <CustomText style={styles.submitButtonText}>Submit</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
  },
  scrollView: {
    alignItems: "center",
    flex: 1,
  },

  titleContainer: {
    flexDirection: "row",
    //marginBottom: 10,
    justifyContent: "center",
  },

  title: {
    //marginVertical: 45,
    fontSize: 40,
    fontFamily: "KronaOne_400Regular",
  },
  titleUp: {
    //marginVertical: 45,
    fontSize: 40,
    fontFamily: "KronaOne_400Regular",
    color: "#515151",
    marginLeft: 10,
  },

  inputsContainerRow: {
    width: "100%",
    //marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textAndInput: {
    width: "600%",
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 10,
  },
  textInput: {
    width: "10%",
    fontSize: 16,
    borderBottomColor: "#BA99FE",
    borderBottomWidth: 2,
    paddingVertical: 5,
    marginTop: 10,
  },
  closeButton: {
    width: 60,
    height: 30,
    top: 10,
    right: -200,
    //marginBottom: 50,
    zIndex: 99,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    //marginVertical: 10,
    padding: 10,
    backgroundColor: "#3972D9",
    borderRadius: 25,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

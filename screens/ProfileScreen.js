import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import GradientFontColor from "../components/GradientFontColor";
// import { Icon } from "react-native-vector-icons/FontAwesome";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import UserDetails from "../components/UserDetails";
import SignModal from "../components/SignModal";

import { useSelector, useDispatch } from "react-redux";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { connect, disconnect, loadDetails } from "../reducers/userInfo";

import SigninForm from "../components/SigninForm";
import SignupForm from "../components/SignupForm";
import { CustomText } from "../components/CustomText";

const { ipAddress, port, backendURLprefix } = require("../myVariables");

export default function ProfileScreen({ navigation }) {
  const { height, width } = useWindowDimensions();
  const userInfo = useSelector((state) => state.userInfo.value);
  // const userToken = useSelector((state) => state.userInfo.value.token);

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const dispatch = useDispatch();

  const closeModal = () => {
    setIsSigningIn(false);
    setIsSigningUp(false);
  };

  // const handleSubmit = () => {
  //   navigation.navigate("Suggestions");
  // };

  const signIn = async (email, password) => {
    //console.log("handleSubmitSigninForm");
    // setIsSigningIn(false);
    //const data = await fetch(`http://${ipAddress}:${port}/users/signin`, {
    const data = await fetch(`${backendURLprefix}users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((resp) => resp.json());
    //console.log(data);
    if (data.result) {
      dispatch(connect(true));
      setIsSigningIn(false);
      dispatch(
        loadDetails({
          token: data.token,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        })
      );
      navigation.navigate("Home");
    }
    return data;
  };

  const signUp = async (firstName, lastName, email, password) => {
    // setIsSigningUp(false);
    //const data = await fetch(`http://${ipAddress}:${port}/users/signup`, {
    const data = await fetch(`${backendURLprefix}users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    }).then((resp) => resp.json());
    // console.log(data);
    if (data.result) {
      dispatch(connect());
      setIsSigningUp(false);
      dispatch(
        loadDetails({
          token: data.token,
          firstName,
          lastName,
          email,
        })
      );
      navigation.navigate("Home");
    }
    return data;
  };

  const signModal = (
    <SignModal
      closeSignModal={() => navigation.navigate("Home")}
      onSignIn={() => setIsSigningIn(true)}
      onSignUp={() => setIsSigningUp(true)}
    />
  );

  const signinForm = (
    <SigninForm
      submit={(email, password) => signIn(email, password)}
      closeModal={closeModal}
    />
  );

  const signupForm = (
    <SignupForm
      submit={(firstName, lastName, email, password) =>
        signUp(firstName, lastName, email, password)
      }
      closeModal={closeModal}
    />
  );

  // const HandlePressLogout = () => {
  //   // console.log("HandlePressLogout");
  //   dispatch(disconnect());
  // };

  const userDetails = <UserDetails logout={() => dispatch(disconnect())} />;

  const modalToShow = () => {
    if (isSigningIn) return signinForm;
    if (isSigningUp) return signupForm;
    if (!userInfo.isConnected) return signModal;
    return userDetails;
  };

  return (
    <SafeAreaView style={[styles.container, { height }]}>
      {modalToShow()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
  scrollView: {
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 26,
    margin: 20,
  },
});

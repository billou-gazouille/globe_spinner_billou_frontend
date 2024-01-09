import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";

import UserDetails from "../components/UserDetails";
import SignModal from "../components/SignModal";

import { useSelector, useDispatch } from "react-redux";

import { connect, disconnect, loadDetails } from "../reducers/userInfo";

import SigninForm from "../components/SigninForm";
import SignupForm from "../components/SignupForm";
import { CustomText } from "../components/CustomText";
import LoadingWheel from "../components/LoadingWheel";

const { backendURLprefix } = require("../myVariables");

export default function ProfileScreen({ navigation }) {
  const { height, width } = useWindowDimensions();
  const userInfo = useSelector((state) => state.userInfo.value);

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const closeModal = () => {
    setIsSigningIn(false);
    setIsSigningUp(false);
  };

  const signIn = async (email, password) => {
    setIsLoading(true);
    const url = `${backendURLprefix}users/signin`;
    const data = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((resp) => resp.json());
    setIsLoading(false);
    if (data.result) {
      setIsSigningIn(false);
      dispatch(
        loadDetails({
          token: data.token,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        })
      );
      dispatch(connect());  // dispatch connect must be AFTER dispatch loadDetails !!
      navigation.navigate("Home");
    }
    return data;
  };

  const signUp = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    const data = await fetch(`${backendURLprefix}users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    }).then((resp) => resp.json());
    setIsLoading(false);
    if (data.result) {
      setIsSigningUp(false);
      dispatch(
        loadDetails({
          token: data.token,
          firstName,
          lastName,
          email,
        })
      );
      dispatch(connect());  // dispatch connect must be AFTER dispatch loadDetails !!
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

  const userDetails = <UserDetails 
    logout={() => dispatch(disconnect())} 
    navigation={navigation} 
  />;

  const modalToShow = () => {
    if (isSigningIn) return signinForm;
    if (isSigningUp) return signupForm;
    if (!userInfo.isConnected) return signModal;
    return userDetails;
  };

  return (
    <SafeAreaView style={[styles.container, { height }]}>
      {isLoading && <LoadingWheel/>}
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

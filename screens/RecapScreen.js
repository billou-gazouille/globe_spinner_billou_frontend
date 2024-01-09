import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GradientFontColor from "../components/GradientFontColor";

const RecapScreen = () => {
  const destination = "London";
  const accommodation = "Hotel ABC";
  const transport = "Flight XYZ";
  const activities = "Picnic Basket, Spa Kit,Rain Poncho";
  const amountPaid = 2500;

  const navigation = useNavigation();
  const handleOkPress = () => {
    navigation.navigate("HomeStack");
 
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/globe.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.overlay}>

        <GradientFontColor style={styles.title}>Recap Trip</GradientFontColor>

        <Text style={styles.subtitle}>Where to</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{destination}</Text>
        </View>

        <Text style={styles.subtitle}>Accommodation</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{accommodation}</Text>
        </View>

        <Text style={styles.subtitle}>Transport</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{transport}</Text>
        </View>

        <Text style={styles.subtitle}>Activities</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{activities}</Text>
        </View>

        <Text style={styles.subtitle}>Amount Paid:</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{amountPaid} euros</Text>
        </View>

        <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "white",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "50%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: "100%",
    height: 100,
  },
  title: {
    marginStart:5,
    marginVertical:50,
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    fontFamily: "KronaOne_400Regular",
    marginTop:40,
  },
  subtitle: {
    fontSize: 15,
    flex: 1,
    fontWeight: "bold",
    marginBottom: 2,
    marginTop:40,
    fontFamily: "KronaOne_400Regular",
  },
  infoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 20,
  },
  okButton: {
    position: "right",
    Right: -50,
    backgroundColor: "#3498db",
    paddingVertical: 7,
    paddingHorizontal: 24,
    borderRadius: 55,
    marginBottom: 10,
  },
  okButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "KronaOne_400Regular",
  },
});

export default RecapScreen;

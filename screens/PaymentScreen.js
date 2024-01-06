import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import GradienFontColor from "../components/GradientFontColor";
import {
  useFonts,
  NunitoSans_400Regular,
} from "@expo-google-fonts/nunito-sans";

import { toggleSaveBankCardDetails } from "../reducers/userInfo";

const { backendURLprefix } = require('../myVariables');
import { useSelector, useDispatch } from "react-redux";

import LoadingWheel from '../components/LoadingWheel';

const PaymentScreen = ({ route }) => {
  const { tripId } = route.params;
  const navigation = useNavigation();

  const userInfo = useSelector((state) => state.userInfo.value);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const currentDate = new Date();

  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState(`${currentDate.getMonth()}`+1);
  const [expiryYear, setExpiryYear] = useState(`${currentDate.getFullYear()}`);
  const [cvv, setCvv] = useState('');

  const expiryDate = new Date(Number(expiryYear), Number(expiryMonth)-1);


  useEffect(() => {
    const loadDetails = async () => {
      const url = `${backendURLprefix}users/${userInfo.token}/bankCardInfo`;
      const { bankCardInfo } = await fetch(url).then(resp => resp.json());
      
      const expiryDate = new Date(bankCardInfo.expiryDate);
      const month = expiryDate.getMonth();
      const year = expiryDate.getFullYear();
      
      setNameOnCard(bankCardInfo.nameOnCard);
      setCardNumber(bankCardInfo.cardNumber);
      setExpiryMonth(`${month+1}`);
      setExpiryYear(`${year}`);
      setCvv(bankCardInfo.cvv);
    };
    
    if (userInfo.saveBankCardDetails){
      // load details from database:
      loadDetails();
    }
  }, []);


  const handlePayPress = async () => {
    if (userInfo.saveBankCardDetails){
      const details = { nameOnCard, cardNumber, expiryDate, cvv };
      const url = `${backendURLprefix}users/${userInfo.token}/addPaiyementInfo`;
      setIsLoading(true);
      const addInfo = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      })
        .then(resp => resp.json());
      setIsLoading(false);
      if (!addInfo.result){
        console.log(addInfo.message);
        return;
      }
    }
    const url = `${backendURLprefix}users/${userInfo.token}/reserveTripById/${tripId}`;
      const pay = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(resp => resp.json());
    if (!pay.result) {
      console.log(pay.error);
      return;
    }
    navigation.navigate("RecapHomeStack");
  };

  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      {isLoading && <LoadingWheel/>}
      <View style={styles.container}>
        <View style={[styles.subtitleContainer, { height: 30 }]}>
          <MaterialIcons name="person" size={21} color="#BA99FE" />

          <Text style={[styles.subtitle, { color: "#414141" }]}>
            Bank Card User
          </Text>
        </View>

        <TextInput
          style={[styles.input, { fontFamily: "NunitoSans_400Regular" }]}
          placeholder="Enter your name"
          value={nameOnCard}
          onChangeText={(text) => setNameOnCard(text)}
        />

        <View style={styles.subtitleContainer}>
          <FontAwesome name="credit-card" size={20} color="#BA99FE" />
          <Text style={[styles.subtitle, { color: "#414141" }]}>
            Card Number
          </Text>
        </View>
        <TextInput
          style={[styles.input, { fontFamily: "NunitoSans_400Regular" }]}
          placeholder="Enter card number" maxLength={16} keyboardType="numeric"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text)}
        />

        <View style={styles.subtitleContainer}>
          <Entypo name="calendar" size={20} color="#BA99FE" />
          <Text style={[styles.subtitle, { color: "#414141" }]}>
            Expiry Date
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <TextInput
            style={{...styles.input, width: '30%', fontFamily: "NunitoSans_400Regular" }}
            placeholder="MM"
            keyboardType="numeric"
            value={expiryMonth}
            onChangeText={(text) => setExpiryMonth(text)}
          />
          <View style={{alignItems: 'center', width: '10%', marginTop: 5}}>
            <Text style={{fontSize: 20}}>/</Text>
          </View>
          <TextInput
            style={{...styles.input, width: '60%', fontFamily: "NunitoSans_400Regular" }}
            placeholder="YYYY"
            keyboardType="numeric"
            value={expiryYear}
            onChangeText={(text) => setExpiryYear(text)}
          />
        </View>

        <View style={styles.subtitleContainer}>
          <FontAwesome name="lock" size={20} color="#BA99FE" />
          <Text style={[styles.subtitle, { color: "#414141" }]}>Code</Text>
        </View>
        <TextInput
          style={{...styles.input,  fontFamily: "NunitoSans_400Regular" }}
          placeholder="CVV"
          value={cvv}
          onChangeText={(text) => setCvv(text)}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            style={{width: 25, height: 25}}
            value={userInfo.saveBankCardDetails}
            onValueChange={() => dispatch(toggleSaveBankCardDetails())}
          />
          <Text
            style={[
              styles.checkboxLabel,
              { fontFamily: "KronaOne_400Regular", fontSize: 12 },
            ]}
          >
            Save bank card details
          </Text>
        </View>

        <Text
          style={[styles.amountText, { fontFamily: "KronaOne_400Regular" }]}
        >
          Amount: 1400€
        </Text>

        <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
          <Text style={{...styles.payButtonText, fontFamily: "KronaOne_400Regular" }}>
            Pay
          </Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/bendy-dotted-line_2.jpg")}
          style={styles.mapImage}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 70,
    backgroundColor: "white",
    flex: 1,
    position: "relative",
    //marginTop: 30,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    marginHorizontal : 10,
    flex: 1,
    fontFamily: "KronaOne_400Regular",
    fontSize: 13,
  },
  subtitleIcon: {
    marginRight: 4,
  },
  fontAwesomeIcon: {
    color: "#EDB8FE",
  },

  input: {
    backgroundColor: "#ECE8F2",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    //margin: -10,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
    justifyContent: "center",
  },
  checkboxLabel: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 11,
    color: "#414141",
  },

  amountText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 10,
    padding: 10,
    color: "#3972D9",
    backgroundColor: "white",
  },
  payButton: {
    borderRadius: 5,
    paddingVertical: 15,
    fontSize: 16,
    marginHorizontal: 25,
    marginBottom: 20,

    borderRadius: 50,

    paddingHorizontal: 60,
    elevation: 4,
    backgroundColor: "#BA99FE",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "KronaOne_400Regular",
  },
  mapImage: {
    width: "190%",
    height: 100,
    resizeMode: "contain",
    marginTop: 5,
    marginLeft: -90,
  },
  imageContainer: {
    width: "50%",
    alignItems: "center",
    marginTop: 20,
  },
  customText: {
    fontFamily: "KronaOne_400Regular",
    fontSize: 24,
  },
});

export default PaymentScreen;

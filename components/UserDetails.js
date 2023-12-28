
import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    useWindowDimensions,
    StatusBar,
} from "react-native";

import GradientFontColor from "../components/GradientFontColor";
import { CustomText } from "../components/CustomText";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import moment from 'moment';

import { useSelector } from "react-redux";

const { ipAddress, port } = require("../myVariables");

import { useIsFocused } from '@react-navigation/native';


import {
  useFonts,
  NunitoSans_400Regular,
} from "@expo-google-fonts/nunito-sans";

export default function UserDetails({ logout }) {

    const userInfo = useSelector((state) => state.userInfo.value);

    const [savedTrips, setSavedTrips] = useState([]);

    const isFocused = useIsFocused(); 

    // const getSavedTrips = async () => {
    //     console.log('getSavedTrips');
    //     const savedTripsReceived = await fetch(`http://${ipAddress}:${port}/users/${userInfo.token}/savedTrips`)
    //         .then(resp => resp.json());
    //     //console.log('savedTripsReceived: ', savedTripsReceived);
    //     setSavedTrips(savedTripsReceived);
    // };

    // useEffect(() => {
    //     getSavedTrips();
    // }, [isFocused]);

    const HandlePressLogout = () => {
        //console.log("HandlePressLogout");
        logout();
    };

    // if (savedTrips.length > 0){
    //     console.log(savedTrips[0].accommodation);
    // }

    const savedTripsJSX = savedTrips.map((trip, i) => {
        const startDate = trip.outboundJourney.transportSlot.departure.date;
        const endDate = trip.inboundJourney.transportSlot.arrival.date;
        const nbDays = moment(endDate).diff(moment(startDate), 'days');
        return (
            <View key={i}>
                <Text style={styles.savedTripText}>- {trip.destination.name}, {trip.destination.country} ({nbDays} days)</Text>
            </View>
        );
    })

    return (
        <View style={styles.container}>
            {/* <Text style={{ fontSize: 30, color: "black" }}>User details...</Text> */}
            <GradientFontColor style={styles.hello}>
                Hello {userInfo.firstname} !
            </GradientFontColor>
            <CustomText style={{ color: "black", fontSize: 26, margin: 20 }}>
                My account info
            </CustomText>
            <View style={styles.userDetailsContainer}>
                <CustomText style={styles.userDetail}>
                first name: {userInfo.firstName}
                </CustomText>
                <CustomText style={styles.userDetail}>
                last name: {userInfo.lastName}
                </CustomText>
                <CustomText style={styles.userDetail}>
                email: {userInfo.email}
                </CustomText>
            </View>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => HandlePressLogout()}
            >
                <Text style={{ fontSize: 16, color: "black" }}>Logout</Text>
                <FontAwesome name="sign-out" size={40} style={styles.logout} />
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={{width: 300, height: 100, borderWidth: 1}}
                onPress={() => getSavedTrips()}
            >
                <Text style={{ fontSize: 16, color: "black" }}>Get saved trips</Text>
            </TouchableOpacity> */}
            <Text style={{...styles.savedTripText, fontSize: 22, fontWeight: 'bold', marginTop: 50, marginBottom: 20}}>Saved trips:</Text>
            {savedTripsJSX}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "left",
        backgroundColor: "red",
        width: "100%",
      },
      userDetail: {
        color: "black",
        fontSize: 24,
        marginBottom: 20,
      },
      savedTripText: {
        color: "white",
        fontSize: 18,
      },
});


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

import moment from 'moment';

import GradientFontColor from "../components/GradientFontColor";
import { CustomText } from "../components/CustomText";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
    
    const getMinimalistTripFormat = (tripDB) => {
        const outboundDeparture = tripDB.outboundJourney.transportSlot.departure.date;
        const inboundArrival = tripDB.inboundJourney.transportSlot.arrival.date;
        const nbrOfNights = Math.abs(moment(inboundArrival).diff(moment(outboundDeparture), "days"));
        return ({
            accommodation: {
                accommodationBase: {
                  //_id: "6578921e5d1d367f59d459a5",
                  address: tripDB.accommodation.accommodationRoom.accommodationBase.address,
                  //contactInfo: {},
                  //description: "Modern hotel with panoramic views of the Mediterranean",
                  //isBreakfastIncluded: true,
                  //location: {},
                  name: tripDB.accommodation.accommodationRoom.accommodationBase.name,
                  //possibleExtras: [],
                  //type: "hotel"
                },
                basePricePerNight: tripDB.accommodation.accommodationRoom.basePricePerNight,
                //bookings: [],
                //locationArray: [2.1734, 41.3851],
                //maxNbPeople: 2,
                //roomNb: "72H",
                //variations: []
              },
              activities: tripDB.activities.map(a => ({
                    activityBase: a.activitySlot.activityBase,
                    startTime: a.activitySlot.startTime,
                    endTime: a.activitySlot.endTime,
                    price: a.activitySlot.price,
                })),
              departureLocation: {
                //country: "Switzerland",
                //distance: "254.20",
                //id: "657833385d1d367f59d45909",
                //lat: 46.5933,
                //lon: 7.9085,
                name: tripDB.outboundJourney.transportSlot.departure.place.name,
              },
              destination: {
                country: tripDB.outboundJourney.transportSlot.arrival.place.country,
                //distance: "531.34",
                //id: "657833385d1d367f59d458e4",
                //lat: 41.3851,
                //lon: 2.1734,
                name: tripDB.outboundJourney.transportSlot.arrival.place.name,
              },
              inboundJourney: {
                arrival: inboundArrival,
                //class: "secondClass",
                departure: tripDB.inboundJourney.transportSlot.departure.date,
                //id: "657b140fca1c0d5ff082aa8a",
                //price: 7.38,
                //seats: {"from": 2, "to": 3},
                type: tripDB.inboundJourney.transportSlot.transportBase.type,
              },
              //nbrOfActivities: 3,
              nbrOfNights: nbrOfNights,
              numberOfTravelers: tripDB.nbOfTravelers,
              outboundJourney: {
                arrival: tripDB.outboundJourney.transportSlot.arrival.date,
                //class: "secondClass",
                departure: outboundDeparture,
                //id: "657b10bc3cdc34e4d613b63b",
                //price: 22.15,
                //seats: {"from": 0, "to": 1},
                type: tripDB.outboundJourney.transportSlot.transportBase.type,
              },
              total: tripDB.totalPaidAmount,
              //totalActivities: 85.42,
              //totalTransport: 29.54
        });
    };

    const getSavedTrips = async () => {
        console.log('getSavedTrips');
        const savedTripsReceived = await fetch(`http://${ipAddress}:${port}/users/${userInfo.token}/savedTrips`)
            .then(resp => resp.json());
        //console.log('savedTripsReceived: ', savedTripsReceived);
        const minimalistTrips = savedTripsReceived.map(t => getMinimalistTripFormat(t));
        console.log('minimalistTrips: ', minimalistTrips);
        setSavedTrips(minimalistTrips);
    };

    useEffect(() => {
        getSavedTrips();
    }, [isFocused]);

    // useEffect(() => {
    //     console.log('useEffect; savedTrips: ', savedTrips);
    // }, [savedTrips]);

    const HandlePressLogout = () => {
        //console.log("HandlePressLogout");
        logout();
    };

    const savedTripsJSX = savedTrips.map((trip, i) => {
        return (
            <View key={i}>
                <Text style={styles.savedTripText}>- {trip.destination.name}, {trip.destination.country} ({trip.nbrOfNights} nights)</Text>
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

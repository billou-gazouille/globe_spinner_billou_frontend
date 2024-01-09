
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

import { CustomText } from "../components/CustomText";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useSelector } from "react-redux";

const { backendURLprefix } = require("../myVariables");

import { useIsFocused } from '@react-navigation/native';

import { unsaveTrip } from "../modules/saveOrUnsaveTrip";
import LoadingWheel from "./LoadingWheel";

const DEFAULT_LANDSCAPE_URI = 'https://images.pexels.com/photos/19511286/pexels-photo-19511286.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';
const imagesAPIprefix = "https://api.pexels.com/v1/search?query=";

const imageAPIoptions = {
    headers: {
      Authorization: "5t6cWcJQKyLgJsDtnmjZX8fLomdIIvsa46xUgeXPcL5AZMAK4r2GODOm",
    },
};


export default function UserDetails({ logout, navigation }) {

    const userInfo = useSelector((state) => state.userInfo.value);

    const [savedTrips, setSavedTrips] = useState([]);
    const [reservedTrips, setReservedTrips] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const isFocused = useIsFocused();
    
    const getMinimalistTripFormat = (tripDB) => {
        const outboundDeparture = tripDB.outboundJourney.transportSlot.departure.date;
        const inboundArrival = tripDB.inboundJourney.transportSlot.arrival.date;
        const nbrOfNights = Math.abs(moment(inboundArrival).diff(moment(outboundDeparture), "days"));
        return ({
            _id: tripDB._id,
            accommodation: {
                accommodationBase: {
                  address: tripDB.accommodation.accommodationRoom.accommodationBase.address,
                  name: tripDB.accommodation.accommodationRoom.accommodationBase.name,
                },
                basePricePerNight: tripDB.accommodation.accommodationRoom.basePricePerNight,
              },
              activities: tripDB.activities.map(a => ({
                    activityBase: a.activitySlot.activityBase,
                    startTime: a.activitySlot.startTime,
                    endTime: a.activitySlot.endTime,
                    price: a.activitySlot.price,
                })),
              departureLocation: {
                name: tripDB.outboundJourney.transportSlot.departure.place.name,
              },
              destination: {
                country: tripDB.outboundJourney.transportSlot.arrival.place.country,
                name: tripDB.outboundJourney.transportSlot.arrival.place.name,
              },
              inboundJourney: {
                arrival: inboundArrival,
                departure: tripDB.inboundJourney.transportSlot.departure.date,
                type: tripDB.inboundJourney.transportSlot.transportBase.type,
              },
              nbrOfNights: nbrOfNights,
              numberOfTravelers: tripDB.nbOfTravelers,
              outboundJourney: {
                arrival: tripDB.outboundJourney.transportSlot.arrival.date,
                departure: outboundDeparture,
                type: tripDB.outboundJourney.transportSlot.transportBase.type,
              },
              total: tripDB.totalPaidAmount,
        });
    };

    const getPlaceImage = async (placeName) => {
        const placeURL = `${imagesAPIprefix}${placeName}+aerial`;
        const place = await fetch(placeURL, imageAPIoptions)
            .then(resp => resp.json()); 
        const landscapeURI = place.photos[0].src.landscape;
        if (landscapeURI === DEFAULT_LANDSCAPE_URI) return require("../assets/default_city.jpg");
        return { uri: landscapeURI };
    };

    const loadSavedTrips = async () => {
        const url = `${backendURLprefix}users/${userInfo.token}/savedTrips`;
        const savedTripsReceived = await fetch(url)
            .then(resp => resp.json());
        const minimalistTrips = savedTripsReceived.map(t => getMinimalistTripFormat(t));
        const imagesURLs = await Promise.all(minimalistTrips.map(t => getPlaceImage(t.destination.name)));
        minimalistTrips.forEach((t, i) => t.img = imagesURLs[i]);
        setSavedTrips(minimalistTrips);
    };

    const loadReservedTrips = async () => {
        const reservedTripsReceived = await fetch(`${backendURLprefix}users/${userInfo.token}/reservedTrips`)
            .then(resp => resp.json());
        const minimalistTrips = reservedTripsReceived.map(t => getMinimalistTripFormat(t));
        const imagesURLs = await Promise.all(minimalistTrips.map(t => getPlaceImage(t.destination.name)));
        minimalistTrips.forEach((t, i) => t.img = imagesURLs[i]);
        setReservedTrips(minimalistTrips);
    };

    useEffect(() => {
        if (!isFocused) return;
        const load = async () => {
            setIsLoading(true);
            await loadSavedTrips();
            await loadReservedTrips();
            setIsLoading(false);
        };
        load();
    }, [isFocused]);

    const HandlePressLogout = () => {
        logout();
    };

    const handleDeleteTrip = async (tripId) => {
        setIsLoading(true);
        await unsaveTrip(true, userInfo.token, tripId);
        loadSavedTrips();
        setIsLoading(false);
    };

    const openTrip = (tripId, isReserved=false) => {
        const trips = [...savedTrips, ...reservedTrips];
        const trip = trips.find(t => t._id === tripId);
        navigation.navigate("SelectedSuggestionsHomeStack", {
            trip: trip,
            img: trip.img,
            tripIndex: null,
            isBookmarked: true,
            tripId: tripId,
            isReserved: isReserved,
          });
    };

    const savedTripsJSX = savedTrips.map((trip, i) => {
        return (
            <View key={i} style={styles.savedTripItem}>
                <TouchableOpacity 
                    style={styles.savedTripButton} 
                    onPress={() => openTrip(trip._id)} 
                >
                    <CustomText style={styles.savedTripText}>{trip.destination.name} ({trip.nbrOfNights} nights)</CustomText>
                </TouchableOpacity> 
                <TouchableOpacity 
                    style={styles.trashButton}
                    onPress={() => handleDeleteTrip(trip._id)}
                >
                    <FontAwesome 
                        name="trash-o" 
                        size={30} 
                        color={'red'} 
                    />
                </TouchableOpacity>          
            </View>
        );
    });

    const reservedTripsJSX = reservedTrips.map((trip, i) => {
        return (
            <View key={i} style={styles.savedTripItem}>
                <TouchableOpacity 
                    style={styles.savedTripButton} 
                    onPress={() => openTrip(trip._id, true)} 
                >
                    <CustomText style={styles.savedTripText}>{trip.destination.name} ({trip.nbrOfNights} nights)</CustomText>
                </TouchableOpacity> 
            </View>
        );
    });

    return (
        <View style={styles.container}>
            {isLoading && <LoadingWheel/>}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CustomText style={{ color: "black", fontSize: 24, margin: 20, fontWeight: 'bold' }}>
                    My account info
                </CustomText>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => HandlePressLogout()}
                >
                    <Text style={{ fontSize: 14, color: "black", fontWeight: 'bold',marginRight: 10 }}>Logout</Text>
                    <FontAwesome name="sign-out" size={30} color={'black'} />
                </TouchableOpacity>
            </View>
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
            
            <CustomText style={styles.savedTripsTitle}>My saved trips ({savedTrips.length})</CustomText>
            {!savedTrips.length && <CustomText style={{fontSize: 16}}>You don't have any saved trips.</CustomText>}
            <ScrollView contentContainerStyle={styles.scrollView}>
                {savedTripsJSX}
            </ScrollView>
            
            <CustomText style={styles.savedTripsTitle}>My reserved trips ({reservedTrips.length})</CustomText>
            {!reservedTrips.length && <CustomText style={{fontSize: 16}}>You don't have any reserved trips.</CustomText>}
            <ScrollView contentContainerStyle={styles.scrollView}>
                {reservedTripsJSX}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '95%',
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
      },
      userDetail: {
        color: "black",
        fontSize: 18,
        marginBottom: 10,
      },
      logoutButton: {
        width: 70,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BA99FE',
        borderRadius: 10,
      },
      savedTripsTitle: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
      },
      savedTripText: {
        color: "white",
        fontSize: 16,
        marginLeft: 10,
      },
      savedTripItem: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginVertical: 10,
        marginLeft: 20,
        width: '90%',
        height: 40,
    },
    savedTripButton: {
        width: '75%', 
        justifyContent: 'center',
        backgroundColor: '#3972D9',
        borderRadius: 10,
    },
    trashButton: {
        width: '15%', 
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
    },
    scrollView: {
        width: '90%',
        borderWidth: 1,
        backgroundColor: '#F4F4F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

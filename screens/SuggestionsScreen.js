import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import SuggestionCard from "../components/SuggestionCard";
import { CustomText } from "../components/CustomText";
import LoadingWheel from "../components/LoadingWheel";
import useFetchGenerate from "../hooks/useFetchGenerate";
import GradientFontColor from "../components/GradientFontColor";
import { saveTrip, unsaveTrip } from "../modules/saveOrUnsaveTrip";
import { resetBookmarks, toggleBookmark, setSuggestedTripId, setSuggestedTripsIds } from "../reducers/userInfo";
import { useIsFocused } from "@react-navigation/native";

const { backendURLprefix } = require("../myVariables");

const DEFAULT_LANDSCAPE_URI = 'https://images.pexels.com/photos/19511286/pexels-photo-19511286.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

export default function SuggestionsScreen({ navigation }) {
  const userInfo = useSelector((state) => state.userInfo.value);
  const filtersFromStore = useSelector((state) => state.filters.value);
  const [triggerFetchGenerate, setTriggerFetchGenerate] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const toggleSave = async (tripIndex, tripId) => {
    const isCurrentlyBookmarked = userInfo.bookmarked[tripIndex];
    if (isCurrentlyBookmarked){
      // unsave:
      unsaveTrip(userInfo.isConnected, userInfo.token, tripId);
    }
    else{
      // save:
      const save = await saveTrip(userInfo.isConnected, userInfo.token, tripIndex);
      if (save.result){
        dispatch(setSuggestedTripId({ index: tripIndex, id: save.tripId }));
      }
    }
    dispatch(toggleBookmark(tripIndex));
  };

  const {
    generatedTrips,
    isLoadingGenerate,
    errorGenerate,
    place1,
    isLoadingPlace1,
    errorPlace1,
    place2,
    isLoadingPlace2,
    errorPlace2,
  } = useFetchGenerate({
    generateRouteURL: `${backendURLprefix}trips/generate`,
    generateFilters: filtersFromStore,
    triggerFirstFetch: triggerFetchGenerate,
  });

  useEffect(() => {
    dispatch(resetBookmarks());
    dispatch(setSuggestedTripsIds([null, null]));
  }, [generatedTrips]);

  const regenerateAll = () => {
    setTriggerFetchGenerate((prev) => !prev);
  };

  useEffect(() => {
    if (!isFocused) return;
    const checkIfTripSaved = async (tripId) => {
      if (!tripId) return false;
      const savedTripsReceived = await fetch(`${backendURLprefix}users/${userInfo.token}/savedTrips`)      
        .then(resp => resp.json());
      const savedTripsIds = savedTripsReceived.map(t => t._id);
      return savedTripsIds.includes(tripId);
    };
    checkIfTripSaved(userInfo.suggestedTripsIds[0]).then(isTrip0saved => {
      if (isTrip0saved !== userInfo.bookmarked[0]) 
        dispatch(toggleBookmark(0));
    });
    checkIfTripSaved(userInfo.suggestedTripsIds[1]).then(isTrip1saved => {
      if (isTrip1saved !== userInfo.bookmarked[1]) 
        dispatch(toggleBookmark(1));
    });
  }, [isFocused]);

  const getImage = (index) => {
    let place;
    if (index === 0) place = place1;
    else if (index === 1) place = place2;
    if (!place) return require("../assets/default_city.jpg");
    const landscapeURI = place.photos[0].src.landscape;
    if (landscapeURI === DEFAULT_LANDSCAPE_URI) return require("../assets/default_city.jpg");
    return { uri: landscapeURI };
  };

  const selectTrip = (tripIndex) => {
    navigation.navigate("SelectedSuggestionsHomeStack", {
      trip: generatedTrips[tripIndex],
      img: getImage(tripIndex),
      tripIndex: tripIndex,
      isBookmarked: userInfo.bookmarked[tripIndex],
      isReserved: false,
    });
  };

  const formattedDate = (stringDate) => {
    const date = new Date(stringDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Note: Months are zero-based, so we add 1
    // Format the result as "dd/mm"
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}`;
  };

  const preventRegenerate =
    isLoadingGenerate || isLoadingPlace1 || isLoadingPlace2;
  const rgBtnColor = preventRegenerate ? "#C2C2C2" : "#3972D9";

  const errorMsg = (msg) => 
    <View style={{
      height: '100%', position:'absolute', justifyContent: 'center', alignItems: 'center'}}>
      <CustomText style={{fontSize: 24, color: 'red'}}>Error generating trips.</CustomText>
      {/* <CustomText style={{fontSize: 18, color: 'red'}}>({msg})</CustomText> */}
      <CustomText style={{fontSize: 24, marginTop: 40}}>Please try again.</CustomText>
    </View>;


  return (
    <SafeAreaView style={styles.container}>
      {errorGenerate && errorMsg(errorGenerate)}
      {isLoadingGenerate && <LoadingWheel />}
      <GradientFontColor style={styles.title}>Suggestions</GradientFontColor>
      <View style={styles.cardsContainer}>
        {generatedTrips &&
          generatedTrips.map((t, i) => {
            const actvitiesMax3 =
              t.activities.length <= 3
                ? t.activities
                : t.activities.slice(0, 3);
            return (
              <SuggestionCard
                key={i}
                tripIndex={i}
                cityName={t.destination.name}
                accommodationType={t.accommodation.accommodationBase.type}
                leaveTransportType={t.outboundJourney.type}
                returnTransportType={t.inboundJourney.type}
                activities={actvitiesMax3.map((a) => a.activityBase.name)}
                img={getImage(i)}
                leaveDate={formattedDate(t.outboundJourney.departure)}
                returnDate={formattedDate(t.inboundJourney.arrival)}
                price={1400}
                selectTrip={selectTrip}
                toggleSave={toggleSave}
                isBookmarked={userInfo.bookmarked[i]}
                tripId={userInfo.suggestedTripsIds[i]}
              />
            );
          })}
      </View>
      <TouchableOpacity
        disabled={preventRegenerate}
        style={{ ...styles.regenerateAllButton, backgroundColor: rgBtnColor }}
        onPress={regenerateAll}
      >
        <CustomText style={styles.regenerateAllText}>REGENERATE ALL</CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  nunitoText: {
    fontFamily: "NunitoSans_400Regular",
  },
  cardsContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "KronaOne_400Regular",
    fontSize: 30,
    color: "#515151",
    marginTop: 20,
  },
  regenerateAllButton: {
    width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  regenerateAllText: {
    fontSize: 16,
    color: "white",
  },
});

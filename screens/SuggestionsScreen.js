import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
// import BackButton from "../components/BackButton";
import { useSelector, useDispatch } from "react-redux";
import SuggestionCard from "../components/SuggestionCard";
import { CustomText } from "../components/CustomText";
import LoadingWheel from "../components/LoadingWheel";
import useFetchGenerate from "../hooks/useFetchGenerate";
import GradientFontColor from "../components/GradientFontColor";
//import toggleBookmarkTrip from "../modules/bookmarkTrip";
import { saveTrip, unsaveTrip } from "../modules/saveOrUnsaveTrip";
import { resetBookmarks, toggleBookmark } from "../reducers/userInfo";

const { ipAddress, port } = require("../myVariables");

export default function SuggestionsScreen({ navigation }) {
  const userInfo = useSelector((state) => state.userInfo.value);
  const filtersFromStore = useSelector((state) => state.filters.value);
  const [triggerFetchGenerate, setTriggerFetchGenerate] = useState(false);
  const dispatch = useDispatch();

  //console.log("userInfo:", filtersFromStore);

  const tripIds = useRef([null, null]);

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
        tripIds.current[tripIndex] = save.tripId;
      }
    }
    dispatch(toggleBookmark(tripIndex));
  };

  //console.log("suggestions", userInfo.bookmarked);

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
    generateRouteURL: `http://${ipAddress}:${port}/trips/generate`,
    generateFilters: filtersFromStore,
    triggerFirstFetch: triggerFetchGenerate,
  });

  useEffect(() => {
    dispatch(resetBookmarks());
  }, [generatedTrips]);

  const regenerateAll = () => {
    //dispatch(resetBookmarks());
    setTriggerFetchGenerate((prev) => !prev);
  };

  const getImage = (index) => {
    let place;
    if (index === 0) place = place1;
    else if (index === 1) place = place2;
    if (!place) return require("../assets/default_city.jpg");
    return { uri: place.photos[0].src.landscape };
  };

  const selectTrip = (tripIndex) => {
    navigation.navigate("SelectedSuggestionsHomeStack", {
      trip: generatedTrips[tripIndex],
      img: getImage(tripIndex),
      tripIndex: tripIndex,
      isBookmarked: userInfo.bookmarked[tripIndex],
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

  return (
    <SafeAreaView style={styles.container}>
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
                tripId={tripIds.current[i]}
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
      {/* <BackButton /> */}
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
    // height: '60%',
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
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

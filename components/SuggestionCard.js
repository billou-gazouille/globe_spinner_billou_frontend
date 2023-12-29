import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { CustomText } from "./CustomText";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useSelector } from "react-redux";

export default function SuggestionCard({
  tripIndex,
  cityName,
  activities,
  img,
  leaveDate,
  returnDate,
  price,
  leaveTransportType,
  returnTransportType,
  accommodationType,
  selectTrip,
  toggleSave,
  isBookmarked,
  tripId,
}) {

  const userInfo = useSelector((state) => state.userInfo.value);
  // only show bookmark if user is connected
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => selectTrip(tripIndex)}
    >
      <View style={styles.cityImgContainer}>
        {userInfo.isConnected && <FontAwesome
          style={styles.bookmark}
          name="bookmark"
          size={30}
          color={isBookmarked ? "#BA99FE" : "white"}
          onPress={() => toggleSave(tripIndex, tripId)}
        />}
        <CustomText
          style={{
            ...styles.cityTitle,
            color: "#ffffff",
            width: "100%",
            textAlign: "center",
          }}
        >
          {cityName}
        </CustomText>
        <Image source={img} style={styles.cityImg} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.infosContainer}>
        <View style={styles.activitiesContainer}>
          {activities.map((a, i) => (
            <CustomText key={i} style={styles.text}>
              -{a}
            </CustomText>
          ))}
        </View>
        <View style={styles.accommodationContainer}>
          <CustomText>{accommodationType}</CustomText>
        </View>
        <View style={styles.transportsContainer}>
          <CustomText>
            {leaveDate}-{returnDate}
          </CustomText>
          <CustomText>
            {leaveTransportType}-{returnTransportType}
          </CustomText>
          {/* <CustomText>{price}€</CustomText> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 200,
    //  borderWidth: 5,
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    borderRadius: 25,
    shadowColor: "black",
    elevation: 5,
    backgroundColor: "white",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Adjust the alpha channel for the desired transparency
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  nunitoText: {
    fontFamily: "NunitoSans_400Regular",
  },
  cityTitle: {
    fontSize: 24,
    // backgroundColor: 'red',
    position: "absolute",
    zIndex: 1,
    color: "black",
  },
  cityImgContainer: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // backgroundColor: 'green',
  },
  bookmark: {
    position: "absolute",
    zIndex: 2,
    right: 20,
    top: 10,
  },
  cityImg: {
    width: "100%",
    height: "100%",
    //resizeMode: 'contain',
    //resizeMode: 'stretch',
    resizeMode: "cover",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  infosContainer: {
    width: "100%",
    height: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  activitiesContainer: {
    // width: '50%',
    // width: '33%',
    justifyContent: "center",
    alignItems: "left",
  },
  text: {
    fontSize: 12,
  },
  accommodationContainer: {
    // width: '50%',
    // width: '33%',
    justifyContent: "center",
    alignItems: "center",
  },
  transportsContainer: {
    // width: '50%',
    // width: '33%',
    justifyContent: "center",
    alignItems: "center",
  },
});

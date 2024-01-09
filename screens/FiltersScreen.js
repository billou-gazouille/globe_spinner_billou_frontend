import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  StatusBar,
  ImageBackground,
  useWindowDimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import DatePickerAndroid from "../components/android/DatePickerAndroid";
import CustomCheckbox from "../components/CustomCheckbox";
import { CustomText } from "../components/CustomText";
import { useDispatch, useSelector } from "react-redux";
import { addFiltersToStore } from "../reducers/filters";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import moment from "moment";

import DatePickerIOS from "../components/ios/DatePickerIOS";

import GradientFontColor from "../components/GradientFontColor";

const transportationMode = ["Train", "Airplane", "Coach"];

export default function FiltersScreen({ navigation }) {
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(
    moment().add(4, "days").toDate()
  );
  const [budget, setBudget] = useState("");
  const [nbrOfTravelers, setNbrOfTravelers] = useState(1);
  const [transportType, setTransportType] = useState([
    "Train",
    "Airplane",
    "Coach",
  ]);
  const [dataSet, setDataSet] = useState([]);
  const [selectedCity, setSelectedCity] = useState({});

  const searchCity = (query) => {
    // Prevent search with an empty query
    if (query === "" || query.length < 3) {
      return;
    }

    fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
      .then((response) => response.json())
      .then(({ features }) => {
        const suggestions = features.map((data, i) => {
          return {
            id: i + 1,
            title: data.properties.label,
            coordinates: data.geometry.coordinates,
          };
        });
        setDataSet(suggestions);
      });
  };


  const selectTransportationMode = (type) => {
    if (!transportType.includes(type)) {
      setTransportType((prevTypes) => [...prevTypes, type]);
    } else {
      setTransportType((prevTypes) => prevTypes.filter((e) => e !== type));
    }
  };
  const checkboxes = transportationMode.map((e, i) => (
    <CustomCheckbox
      key={i}
      text={e}
      selectTransportationMode={selectTransportationMode}
    />
  ));

  const handleSubmit = () => {
    const filters = {
      departureLocation: selectedCity.coordinates,
      budget,
      nbrOfTravelers,
      transportType,
      departureDate,
      returnDate,
    };
    dispatch(addFiltersToStore({ filters }));
    navigation.navigate("SuggestionsHomeStack");
  };

  const checkHasEmptyField = (fields) =>
    fields.some((field) => !field || field === "" || field.length === 0);

  const handlePressSubmit = () => {
    // return true; // comment this line if you don't want to bypass the filters
    const requiredFields = [
      selectedCity.coordinates,
      budget,
      nbrOfTravelers,
      transportType,
      departureDate,
      returnDate,
    ];
    if (checkHasEmptyField(requiredFields)) {
      return Alert.alert("Some fields are missing!");
    }
    return true;
  };

  const callHandleAndHandlePress = () => {
    const result = handlePressSubmit();
    if (result) {
      handleSubmit();
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your </Text>
          <GradientFontColor style={styles.title}>filters</GradientFontColor>
        </View>

        <View style={styles.inputDepartureContainerRow}>
          <CustomText>Departure: </CustomText>
          <AutocompleteDropdown
            onChangeText={(text) => searchCity(text)}
            onSelectItem={(item) =>
              item &&
              setSelectedCity((selectedCity) => ({
                ...selectedCity,
                ...item,
              }))
            }
            textInputProps={{
              placeholder: "Search city",
              style: {
                paddingLeft: 13,
              },
            }}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            dataSet={dataSet}
          />
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <StatusBar style="auto" />

          <CustomText style={styles.travelText}>
            How will you travel?
          </CustomText>

          <View style={styles.checkboxes}>{checkboxes}</View>
          <ImageBackground
            source={require("../assets/bendy-dotted-line_2.jpg")}
            style={styles.imageBackground}
          >
            <View style={[styles.sectionTitle, { width: width }]}>
              <CustomText style={styles.sectionTextTitle}>DATES</CustomText>
            </View>
            <View style={styles.date}></View>
          </ImageBackground>
          {Platform.OS === "android" ? (
            <DatePickerAndroid
              departureDate={departureDate}
              returnDate={returnDate}
              onDepartureDateChange={(event, selectedDate) => {
                setDepartureDate(selectedDate || departureDate);
              }}
              onReturnDateChange={(event, selectedDate) => {
                setReturnDate(selectedDate || returnDate);
              }}
            />
          ) : (
            <DatePickerIOS
              departureDate={departureDate}
              returnDate={returnDate}
              onDepartureDateChange={(event, selectedDate) => {
                setDepartureDate(selectedDate || departureDate);
              }}
              onReturnDateChange={(event, selectedDate) => {
                setReturnDate(selectedDate || returnDate);
              }}
            />)
          }
          <ImageBackground
            source={require("../assets/bendy-dotted-line_2.jpg")}
            style={styles.imageBackground}
          >
            <View style={[styles.sectionTitle, { width: width }]}>
              <CustomText style={styles.sectionTextTitle}>Details</CustomText>
            </View>
          </ImageBackground>

          <View style={styles.inputContainerRow}>
            <View style={styles.inputContainer}>
              <CustomText>How many people:</CustomText>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="E.g. 3"
                onChangeText={(number) => setNbrOfTravelers(Number(number))}
              />
            </View>
            <View style={styles.inputContainer}>
              <CustomText>Budget:</CustomText>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="E.g. 300€"
                onChangeText={(number) => setBudget(number)}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={callHandleAndHandlePress}
            style={styles.button}
          >
            <CustomText style={styles.buttonText}>Go!</CustomText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 30,
    justifyContent: "center",
  },
  title: {
    fontFamily: "KronaOne_400Regular",
    fontSize: 30,
    color: "#515151",
    marginTop: 20,
  },
  sectionTitle: {
    marginTop: 25,
    alignItems: "center",
  },

  sectionTextTitle: {
    backgroundColor: "white",
    fontSize: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    textTransform: "uppercase",
  },
  inputDepartureContainerRow: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 99,
  },

  inputContainerRow: {
    width: "100%",
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItemps: "baseline",
    flexWrap: "wrap",
  },
  inputContainer: {
    width: "43%",
  },
  departureInput: {
    flexDirection: "row",
  },
  input: {
    fontSize: 16,
    borderBottomColor: "#BA99FE",
    borderBottomWidth: 2,
    paddingVertical: 5,
    marginTop: 10,
  },
  checkboxes: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  travelText: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  fieldsError: {
    fontSize: 20,
    marginBottom: 20,
    color: "red",
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 60,
    elevation: 3,
    backgroundColor: "#3972D9",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});

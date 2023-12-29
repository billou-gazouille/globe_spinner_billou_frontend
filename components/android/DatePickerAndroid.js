// Android specific API
import { useState } from "react";
import { Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function DatePickerAndroid({
  departureDate,
  returnDate,
  onDepartureDateChange,
  onReturnDateChange,
}) {

  //! Don't remove the <event> function param or it will crash
  function onDateChange(event, selectedDate) {
    setDate(selectedDate);
  }

  function showDepartureDatePicker() {
    DateTimePickerAndroid.open({
      value: departureDate,
      onChange: onDepartureDateChange,
      mode: "date",
    });
  }

  function showReturnDatePicker() {
    DateTimePickerAndroid.open({
      value: returnDate,
      onChange: onReturnDateChange,
      mode: "date",
    });
  }

  return (
    <>
      <Text> FROM: {departureDate.toLocaleString().split(',')[0]} </Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => showDepartureDatePicker()} >
        <Text style={styles.buttonText}>Select departure date</Text>
      </TouchableOpacity>

      <Text> TO: {returnDate.toLocaleString().split(',')[0]} </Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => showReturnDatePicker()} >
        <Text style={styles.buttonText}>Select return date</Text>
      </TouchableOpacity>
    </>
  );
}


const styles = StyleSheet.create({
  dateButton: {
    width: 200, 
    height: 30, 
    backgroundColor: '#3972D9',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
  },
});
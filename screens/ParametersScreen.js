import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";

import { CustomText } from "../components/CustomText";

export default function ParametersScreen({ navigation }) {

  const [settings, setSettings] = useState([
    { name: 'Language', value: 'English', options: ['English', 'French', 'Spanish'] },
    { name: 'Use my location', value: 'off', options: ['off', 'on'] },
    { name: 'Trip suggestions', value: 2, options: [1, 2, 3] },
    { name: 'Notifications', value: 'off', options: ['off', 'on'] },
    { name: 'Emails', value: 'off', options: ['off', 'on'] },
    { name: 'Dark mode', value: 'off', options: ['off', 'on'] },
  ]);

  const nextSettingValue = (settingName) => {
    const settingIndex = settings.findIndex(s => s.name === settingName);
    const setting = settings[settingIndex];
    const prevOptionIndex = setting.options.indexOf(setting.value);
    const nextOptionIndex = (prevOptionIndex+1) % setting.options.length;
    const nextValue = setting.options[nextOptionIndex];
    const settingsCopy = [...settings];
    settingsCopy[settingIndex] = { ...settingsCopy[settingIndex], value: nextValue };
    setSettings(settingsCopy);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <CustomText style={styles.title}>Settings (fake)</CustomText>
      {settings.map((s, i) => 
        (<View key={i} style={styles.setting}>
          <CustomText style={styles.settingName}>{s.name}</CustomText>
          <CustomText style={styles.settingValue}>{s.value}</CustomText>
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => nextSettingValue(s.name)}
          >
            <CustomText style={styles.settingArrow}>&#8594;</CustomText>
          </TouchableOpacity>
        </View>)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 38,
    marginTop: 60,
    marginBottom: 30,
  },
  setting: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  settingName: {
    justifyContent: 'center',
    fontSize: 18,
    marginRight: 20,
  },
  settingValue: {
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  settingButton: {
    width: 30,
    height: 30,
    backgroundColor: '#3972D9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingArrow: {
    color: 'white',
  },
});

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { View } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import ParametersScreen from "./screens/ParametersScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SuggestionsScreen from "./screens/SuggestionsScreen";
import PaymentScreen from "./screens/PaymentScreen";
import RecapScreen from "./screens/RecapScreen";
import filters from "./reducers/filters";
import userInfo from "./reducers/userInfo";
import FiltersScreen from "./screens/FiltersScreen";
import SelectedSuggestionsScreen from "./screens/SelectedSuggestionsScreen";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({ filters, userInfo });

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistReducer(persistConfig, persistedReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerBackTitleVisible: false,
        headerBackVisible: true,
        headerTintColor: "#ba99FE",
        headerTransparent: true,
      }}
    >
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="FiltersHomeStack" component={FiltersScreen} />
      <Stack.Screen name="SuggestionsHomeStack" component={SuggestionsScreen} />
      <Stack.Screen
        name="SelectedSuggestionsHomeStack"
        component={SelectedSuggestionsScreen}
      />
      <Stack.Screen name="PaymentHomeStack" component={PaymentScreen} />
      <Stack.Screen name="RecapHomeStack" component={RecapScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  let iconBackgroundColor = "#ba99fe";
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "user";
          } else if (route.name === "Parameters") {
            iconName = "gear";
          }

          return (
            <View
              style={{
                backgroundColor: focused ? "rgba(255,255,255,0.33)" : null,
                justifyContent: "space-between",
                alignItems: "center",
                height: "90%",
                width: "70%",
                borderRadius: 10,
                paddingVertical: 10,
              }}
            >
              <FontAwesome name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarLabel: () => null,
        tabBarActiveBackgroundColor: iconBackgroundColor,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#CBCBE4",
        headerShown: false,
        tabBarStyle: { backgroundColor: "#ba99fe" },
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Parameters" component={ParametersScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  //persistor.purge();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

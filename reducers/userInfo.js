import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    isConnected: false,
    token: null,
    firstName: null,
    lastName: null,
    email: null,
    bookmarked: [false, false],
    suggestedTripsIds: [null, null],
    saveBankCardDetails: false, // saved in database
  },
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    loadDetails: (state, action) => {
      state.value.token = action.payload.token;
      state.value.firstName = action.payload.firstName;
      state.value.lastName = action.payload.lastName;
      state.value.email = action.payload.email;
    },
    connect: (state) => {
      state.value.isConnected = true;
    },
    disconnect: (state) => {
      //state.value.isConnected = false;
      //console.log('state.value before: ', state.value);
      state.value = {...initialState.value};
      state.value.isConnected = false;
      //console.log('state.value after: ', state.value);
    },
    toggleBookmark: (state, action) => {
      //console.log("action", action.payload);
      state.value.bookmarked[action.payload] =
        !state.value.bookmarked[action.payload];
      //console.log("store", state.value.bookmarked);
    },
    resetBookmarks: (state) => {
      state.value.bookmarked = [false, false];
    },
    setSuggestedTripId: (state, action) => {
      const { index, id } = action.payload;
      state.value.suggestedTripsIds[index] = id;
    },
    setSuggestedTripsIds: (state, action) => {
      state.value.suggestedTripsIds = action.payload;
    },
    toggleSaveBankCardDetails: (state) => {
      state.value.saveBankCardDetails = !state.value.saveBankCardDetails;
    },
  },
});

export const {
  connect,
  disconnect,
  loadDetails,
  toggleBookmark,
  resetBookmarks,
  setSuggestedTripId,
  setSuggestedTripsIds,
  toggleSaveBankCardDetails,
} = userInfoSlice.actions;
export default userInfoSlice.reducer;

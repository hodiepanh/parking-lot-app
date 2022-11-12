import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import default_image from "../assets/default_image.png";
import { parkingApi } from "../api/parkingDataApi";

let initialState = {
  value: [
    { id: 0, title: "Parking Lot A" },
    { id: 1, title: "Parking Lot B" },
    { id: 2, title: "Parking Lot C" },
  ],
  standardImage: default_image,
};

export const getParkingLotRex = createAsyncThunk(
  "parkinglots/get",
  async () => {
    const response = await parkingApi.getParkingLot();
    const data = response.data;
    //console.log(data);
    return data;
  }
);

export const addParkingLotRex = createAsyncThunk(
  "parkinglots/add",
  async (newLot) => {
    const response = await parkingApi.addParkingLot(newLot);
    const data = response.data;
    //console.log(data);
    return data;
  }
);

export const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    setParkingLot: (state, action) => {
      state.value = action.payload;
      console.log(state.value);
    },
    getParkingLot: (state) => {
      console.log(state.value);
    },
    addParkingLot: (state, action) => {
      const newLot = { id: 3, title: action.payload };
      state.value = [...state.value, newLot];
      console.log(state.value);
    },
    setReferenceImage: (state, action) => {
      const newImage = action.payload;
      //console.log(action.payload);
      state.standardImage = newImage;
      //console.log(state.standardImage);
    },
  },
  extraReducers: {
    [getParkingLotRex.fulfilled]: (state, action) => {
      state.value = action.payload;
      //console.log(state.value);
    },
    [addParkingLotRex.fulfilled]: (state, action) => {
      //const newLot = { id: state.value.length(), title: action.payload };
      state.value = [...state.value, action.payload];
    },
  },
});

// Action creators are generated for each case reducer functions
export const {
  addParkingLot,
  setParkingLot,
  getParkingLot,
  setReferenceImage,
} = parkingSlice.actions;

export default parkingSlice.reducer;

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

export const deleteParkingLotRex = createAsyncThunk(
  "parkinglots/delete",
  async (index) => {
    const resp = await parkingApi.deleteParkingLot(index);
    const dataOb = { data: resp.data, id: index };
    return dataOb;
  }
);

export const searchParkingLotRex = createAsyncThunk(
  "parkinglots/search",
  async (searchValue) => {
    const resp = await parkingApi.searchParkingLot(searchValue);
    const data = resp.data;
    console.log(data);
    return data;
  }
);

export const editLandmarkRex = createAsyncThunk(
  "parkinglots/edit",
  async (editData) => {
    //console.log(editData);
    const id = editData.id;
    const edit_data = editData.landmarkList;
    const resp = await parkingApi.editLandmark(id, edit_data);
    const data = resp.data;
    //console.log(data);
    return data;
  }
);

export const editSlotRex = createAsyncThunk(
  "parkinglots/edit",
  async (editData) => {
    //console.log(editData);
    const id = editData.id;
    const edit_data = editData.parkingslotList;
    const resp = await parkingApi.editParkingSlot(id, edit_data);
    const data = resp.data;
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
    [deleteParkingLotRex.fulfilled]: (state, action) => {
      const index = action.payload.id;
      const delItems = state.value.filter((items) => items.id !== index);
      state.value = [...delItems];
      state.loading = false;
    },
    [editLandmarkRex.fullfilled]: (state, action) => {
      console.log(action.payload);
      // let id = Number(action.payload.id);
      // state.value[id].title = action.payload.title;
      // state.loading = false;
    },
    [editSlotRex.fullfilled]: (state, action) => {
      console.log(action.payload);
      // let id = Number(action.payload.id);
      // state.value[id].title = action.payload.title;
      // state.loading = false;
    },
    [searchParkingLotRex.fulfilled]: () => {},
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

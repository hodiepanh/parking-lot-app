import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import default_image from "../assets/default_image.png";
import { parkingApi } from "../api/parkingDataApi";

let initialState = {
  value: [],
  standardImage: default_image,
  notification: { open: false, status: "", message: "" },
  alert: { open: false, message: "", data: {} },
  loading: false,
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
    const newLandmarkList = edit_data.map((data, index) => ({
      id: index,
      x1: data.x1,
      y1: data.y1,
      x2: data.x2,
      y2: data.y2,
    }));
    const resp = await parkingApi.editLandmark(id, newLandmarkList);
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

export const editImageRex = createAsyncThunk(
  "parkinglots/edit",
  async (editData) => {
    //console.log(editData);
    const id = editData.id;
    const edit_data = editData.formData;
    const resp = await parkingApi.editReferenceImage(id, edit_data);
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
      if (action.payload == "default") {
        const newImage = default_image;
        state.standardImage = newImage;
      } else {
        const newImage = require(`../assets/Reference/${action.payload}`);
        state.standardImage = newImage;
      }
    },
    setResultImage: (state, action) => {
      console.log(typeof action.payload);
      const newImage = action.payload;
      state.standardImage = newImage;
    },
    openNotification: (state, action) => {
      state.notification = {
        open: true,
        status: action.payload.status,
        message: action.payload.message,
      };
    },
    closeNotification: (state) => {
      state.notification.open = false;
    },
    openAlert: (state, action) => {
      state.alert = {
        open: true,
        message: action.payload.message,
        data: action.payload.data,
      };
    },
    closeAlert: (state) => {
      state.alert.open = false;
    },
  },
  extraReducers: {
    [getParkingLotRex.pending]: (state) => {
      state.loading = true;
    },
    [getParkingLotRex.fulfilled]: (state) => {
      state.loading = false;
    },
    [getParkingLotRex.rejected]: (state) => {
      state.loading = true;
    },
    [addParkingLotRex.pending]: (state) => {
      state.loading = true;
    },
    [addParkingLotRex.fulfilled]: (state, action) => {
      //const newLot = { id: state.value.length(), title: action.payload };
      state.value = [...state.value, action.payload.title];
      state.notification = {
        open: true,
        status: "success",
        message: "New parking lot added",
      };
      state.loading = false;
    },
    [addParkingLotRex.rejected]: (state) => {
      state.loading = true;
    },
    [deleteParkingLotRex.pending]: (state) => {
      state.loading = true;
    },
    [deleteParkingLotRex.fulfilled]: (state, action) => {
      const index = action.payload.id;
      const delItems = state.value.filter((items) => items.id !== index);
      state.value = [...delItems];
      state.loading = false;
    },
    [deleteParkingLotRex.rejected]: (state) => {
      state.loading = true;
    },
    [editLandmarkRex.pending]: (state) => {
      state.loading = true;
    },
    [editLandmarkRex.fullfilled]: (state, action) => {
      console.log(action.payload);
      // let id = Number(action.payload.id);
      // state.value[id].title = action.payload.title;
      state.loading = false;
    },
    [editLandmarkRex.rejected]: (state) => {
      state.loading = true;
    },
    [editSlotRex.pending]: (state) => {
      state.loading = true;
    },
    [editSlotRex.fullfilled]: (state, action) => {
      console.log(action.payload);
      // let id = Number(action.payload.id);
      // state.value[id].title = action.payload.title;
      state.loading = false;
    },
    [editSlotRex.rejected]: (state) => {
      state.loading = true;
    },
    [editImageRex.pending]: (state) => {
      state.loading = true;
    },
    [editImageRex.fullfilled]: (state, action) => {
      console.log(action.payload);
      state.loading = false;
    },
    [editImageRex.rejected]: (state) => {
      state.loading = true;
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
  setResultImage,
  closeNotification,
  openNotification,
  openAlert,
  closeAlert,
} = parkingSlice.actions;

export default parkingSlice.reducer;

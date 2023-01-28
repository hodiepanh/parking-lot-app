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

//get all parking lots data
export const getParkingLotRex = createAsyncThunk(
  "parkinglots/get",
  async () => {
    const response = await parkingApi.getParkingLot();
    const data = response.data;
    //console.log(data);
    return data;
  }
);

//get parking lot data by ID
export const getParkingLotByIdRex = createAsyncThunk(
  "parkinglots/get",
  async (id) => {
    const response = await parkingApi.getParkingLotById(id);
    const data = response.data;
    //console.log(data);
    return data;
  }
);

//add a new parking lot
export const addParkingLotRex = createAsyncThunk(
  "parkinglots/add",
  async (newLot) => {
    const response = await parkingApi.addParkingLot(newLot);
    const data = response.data;
    console.log(data);
    return data;
  }
);

//delete a parking lot
export const deleteParkingLotRex = createAsyncThunk(
  "parkinglots/delete",
  async (index) => {
    const resp = await parkingApi.deleteParkingLot(index);
    const dataOb = { data: resp.data, id: index };
    return dataOb;
  }
);

//search a parking lot (not in use)
export const searchParkingLotRex = createAsyncThunk(
  "parkinglots/search",
  async (searchValue) => {
    const resp = await parkingApi.searchParkingLot(searchValue);
    const data = resp.data;
    console.log(data);
    return data;
  }
);

//edit landmarks detail
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

//edit parking slots detail
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

//edit Region of Interest details
export const editRoiRex = createAsyncThunk(
  "parkinglots/edit",
  async (editData) => {
    //console.log(editData);
    const id = editData.id;
    const edit_data = editData.roiList;
    const resp = await parkingApi.editRoi(id, edit_data);
    const data = resp.data;
    //console.log(data);
    return data;
  }
);

//upload image
export const editImageRex = createAsyncThunk(
  "parkinglots/edit",
  async (editData) => {
    const id = editData.id;
    const edit_data = editData.formData;
    const resp = await parkingApi.editReferenceImage(id, edit_data);
    const data = resp.data;
    //console.log(data);
    return data;
  }
);

//calibrate image
export const editCalibratedRex = createAsyncThunk(
  "parkinglots/edit",
  async (editData) => {
    //console.log(editData);
    const id = editData.id;
    const title = editData.title;
    //const edit_data = editData.formData;
    const resp = await parkingApi.editCalibratedImage(id, title);
    const data = resp.data;
    //console.log(data);
    return data;
  }
);

export const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
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
    //get all parking lot data
    [getParkingLotRex.pending]: (state) => {
      state.loading = true;
    },
    [getParkingLotRex.fulfilled]: (state) => {
      state.loading = false;
    },
    [getParkingLotRex.rejected]: (state) => {
      state.loading = true;
    },

    //get parking lot data by ID
    [getParkingLotByIdRex.pending]: (state) => {
      state.loading = true;
    },
    [getParkingLotByIdRex.fullfilled]: (state) => {
      state.loading = false;
    },
    [getParkingLotByIdRex.rejected]: (state) => {
      state.loading = true;
    },

    //add a new parking lot
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

    //delete parking lot
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

    //edit landmarks details
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

    //edit parking slot details
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

    //edit Region of Interest details
    [editRoiRex.pending]: (state) => {
      state.loading = true;
    },
    [editRoiRex.fullfilled]: (state, action) => {
      console.log(action.payload);
      // let id = Number(action.payload.id);
      // state.value[id].title = action.payload.title;
      state.loading = false;
    },
    [editRoiRex.rejected]: (state) => {
      state.loading = true;
    },

    //upload reference image
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

    //calibrate image
    [editCalibratedRex.pending]: (state) => {
      state.loading = true;
    },
    [editCalibratedRex.fullfilled]: (state, action) => {
      console.log(action.payload);
      state.loading = false;
    },
    [editCalibratedRex.rejected]: (state) => {
      state.loading = true;
    },

    //search parking lot
    [searchParkingLotRex.fulfilled]: () => {},
  },
});

// Action creators are generated for each case reducer functions
export const {
  closeNotification,
  openNotification,
  openAlert,
  closeAlert,
} = parkingSlice.actions;

export default parkingSlice.reducer;

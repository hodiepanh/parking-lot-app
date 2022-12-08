import { IndeterminateCheckBoxSharp } from "@mui/icons-material";
import axios from "axios";
import { appendErrors } from "react-hook-form";

// const app = axios.create({
//   baseURL: "http://localhost:5000/parkinglots",
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Content-Type": "application/json",
//   },
//   withCredentials: false,
// });

const url = "http://localhost:3001/parkinglots";
//const url = "http://localhost:5000/parkinglots";
export const parkingApi = {
  getParkingLot: () => {
    return axios.get("http://localhost:5000/parkinglots");
  },
  addParkingLot: (newName) => {
    const newLot = { title: newName };
    //console.log(newLot);
    return axios.post("http://localhost:5000/parkinglots", newLot);
    //return axios.post(`${url}`, newLot);
  },
  deleteParkingLot: (index) => {
    return axios.delete(`http://localhost:5000/parkinglots/${index}`);
    //return axios.delete(`${url}/${index}`);
  },
  searchParkingLot: (searchLot) => {
    return appendErrors.get(`${url}?title_like=${searchLot}`);
  },
  editLandmark: (id, data) => {
    return axios.patch(`http://localhost:5000/parkinglots/${id}/landmark`, {
      landmark: data,
    });
    // return axios.patch(`${url}/${id}`, {
    //   landmark: data,
    // });
  },
  editParkingSlot: (id, data) => {
    return axios.patch(`http://localhost:5000/parkinglots/${id}/slot`, {
      slot: data,
    });
  },
  editReferenceImage: (id, data) => {
    return axios.post(`http://localhost:5000/parkinglots/${id}/image`, data);
  },
};

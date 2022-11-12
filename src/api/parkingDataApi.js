import axios from "axios";

const url = "http://localhost:3001/parkinglots";

export const parkingApi = {
  getParkingLot: () => {
    return axios.get(url);
  },
  addParkingLot: (newName) => {
    const newLot = { title: newName };
    //console.log(newLot);
    return axios.post(`${url}`, newLot);
  },
  deleteParkingLot: (index) => {
    return axios.delete(`${url}/${index}`);
  },
  searchParkingLot: (searchLot) => {
    return axios.get(`${url}?title_like=${searchLot}`);
  },
  editParkingLot: (id, data) => {
    return axios.patch(`${url}/${id}`, {
      title: data,
    });
  },
};

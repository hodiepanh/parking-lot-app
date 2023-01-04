import axios from "axios";

//const url = "http://localhost:3001/parkinglots";
const baseURL = "http://localhost:5000";
const url = "/parkinglots";

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const parkingApi = {
  getParkingLot: () => {
    return axiosClient.get(url);
  },
  getParkingLotById: (id) => {
    return axiosClient.get(`${url}/${id}`);
  },
  addParkingLot: (newName) => {
    const newLot = { title: newName };
    //console.log(newLot);
    //return axios.post("http://localhost:5000/parkinglots", newLot);
    return axiosClient.post(`${url}`, newLot);
  },
  deleteParkingLot: (index) => {
    //return axios.delete(`http://localhost:5000/parkinglots/${index}`);
    return axiosClient.delete(`${url}/${index}`);
  },
  searchParkingLot: (searchLot) => {
    return axiosClient.get(`${url}?title_like=${searchLot}`);
  },
  editLandmark: (id, data) => {
    // return axios.patch(`http://localhost:5000/parkinglots/${id}/landmark`, {
    //   landmark: data,
    // });
    return axiosClient.patch(`${url}/${id}/landmark`, {
      landmark: data,
    });
  },
  editParkingSlot: (id, data) => {
    return axiosClient.patch(`${url}/${id}/slot`, {
      slot: data,
    });
  },
  editRoi: (id, data) => {
    return axiosClient.patch(`${url}/${id}/roi`, {
      roi: data,
    });
  },
  editReferenceImage: (id, data) => {
    return axiosClient.post(`${url}/${id}/image`, data);
  },
  editCalibratedImage: (id, title) => {
    return axiosClient.post(`${url}/${id}/calibrate`, {
      title: title,
    });
  },
};

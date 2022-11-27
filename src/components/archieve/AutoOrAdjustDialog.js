import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { getParkingLotRex, setParkingLot } from "../../redux/parkingLots";
import { parkingApi } from "../../api/parkingDataApi";

export default function AutoOrAdjustDialog({ open, setOpen }) {
  //const [open, setOpen] = React.useState(openDefine);
  //const [defineName, setDefineName] = useState("");
  const [chosenLot, setChosenLot] = useState("");
  const [parkingListdb, setParkingListdb] = useState([]);
  const history = useHistory();
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();

  useEffect(() => {
    // parkingApi.getParkingLot().then((res) => {
    //   setParkingListdb(res.data);
    //   dispatch(setParkingLot(res.data));
    // });
    dispatch(getParkingLotRex())
      .unwrap()
      .then((res) => {
        setParkingListdb(res);
        //console.log(res);
      });
  }, [dispatch, open]);

  const parkingMap = parkingListdb.map((data, index) => (
    <MenuItem key={index} value={data.title}>
      {data.title}
    </MenuItem>
  ));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setChosenLot(event.target.value);
  };

  const toCalib = (name) => {
    history.push(`/calib/${name}`);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>DEFINE NEW PARKING LOT</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Available Parking Lots
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenLot}
              label="Available Parking Lots"
              onChange={handleChange}
            >
              {parkingMap}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              toCalib(chosenLot);
            }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

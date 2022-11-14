import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addParkingLot, addParkingLotRex } from "../../redux/parkingLots";
import Notification from "./Notification";
import axios from "axios";
import { parkingApi } from "../../api/parkingDataApi";

export default function DefineDialog({ open, setOpen }) {
  //const [open, setOpen] = React.useState(openDefine);
  const [defineName, setDefineName] = useState("");
  const [definedStatus, setDefinedStatus] = useState("");
  const [openNoti, setOpenNoti] = useState(false);

  const history = useHistory();
  //const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();

  useEffect(() => {
    // axios.get("http://localhost:3001/parkinglots").then((res) => {
    //   console.log(res.data);
    // });
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toReference = () => {
    // history.push("reference");
    //window.location.reload(false);
  };

  const addParkingLot = (name) => {
    dispatch(addParkingLotRex(name))
      .unwrap()
      .then((res) => {
        //dispatch(addParkingLot(res));
        //console.log(res);
      });
    // parkingApi.addParkingLot(name);
    setDefinedStatus("success");
    setOpenNoti(true);
    // toReference();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>AVAILABLE PARKING LOTS</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New parking lot name"
            // type="email"
            fullWidth
            variant="standard"
            value={defineName}
            onChange={(e) => {
              setDefineName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              //console.log(parkingList);
              //dispatch(addParkingLot(defineName));
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              addParkingLot(defineName);
            }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        severity={definedStatus}
        open={openNoti}
        setOpen={setOpenNoti}
      />
    </div>
  );
}

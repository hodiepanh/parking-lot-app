import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";

//import redux state management
import { useSelector, useDispatch } from "react-redux";
import { addParkingLotRex, openNotification } from "../../redux/parkingLots";

//import component
import Notification from "./Notification";

export default function DefineDialog({ open, setOpen, lotsList, setLotsList }) {
  const [defineName, setDefineName] = useState("");

  //redux state managemeent
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();

  //close Define Dialog
  const handleClose = () => {
    setOpen(false);
  };

  //add new parking lot
  const addParkingLot = (name) => {
    //get parking lots title from parking lots data (title, id, landmarks, slots)
    const titleList = lotsList.map((data) => data.title);

    //validator: title cannot be blank
    if (name != "") {
      //if name already exists -> show error notification
      if (titleList.includes(name)) {
        dispatch(
          openNotification({
            status: "error",
            message: "Parking lot already exists. Choose another name.",
          })
        );
      } else {
        //if name is not blank -> add new parking lot to database
        dispatch(addParkingLotRex(name))
          .unwrap()
          .then((res) => {
            lotsList.push(res);
          });
      }
    } else {
      dispatch(
        openNotification({
          status: "error",
          message: "Name of parking lot cannot be blank.",
        })
      );
    }
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
            variant="outlined"
            onClick={() => {
              addParkingLot(defineName);
            }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <Notification />
    </div>
  );
}

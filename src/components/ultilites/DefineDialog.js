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
import {
  addParkingLotRex,
  getParkingLot,
  getParkingLotRex,
  setParkingLot,
} from "../../redux/parkingLots";
import Notification from "./Notification";

export default function DefineDialog({ open, setOpen, lotsList, setLotsList }) {
  const [defineName, setDefineName] = useState("");
  const [definedStatus, setDefinedStatus] = useState("");
  const [openNoti, setOpenNoti] = useState(false);
  const [titleList, setTitleList] = useState([]);

  const history = useHistory();
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log(lotsList);
    // dispatch(getParkingLotRex())
    //   .unwrap()
    //   .then((res) => {
    //     for (let i = 0; i < res.length; i++) {
    //       titleList.push(res[i].title);
    //     }
    //   });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addParkingLot = (name) => {
    for (let i = 0; i < lotsList.length; i++) {
      titleList.push(lotsList[i].title);
    }
    //console.log(titleList);
    if (name != "") {
      if (titleList.includes(name)) {
        setDefinedStatus("error");
      } else {
        dispatch(addParkingLotRex(name))
          .unwrap()
          .then((res) => {
            lotsList.push(res);
          });
        setDefinedStatus("success");

        //load new parking lot
        //window.location.reload(false);
      }
    } else {
      setDefinedStatus("warning");
    }
    setOpenNoti(true);
    //console.log(lotsList);
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
          <Button onClick={handleClose}>Cancel</Button>
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

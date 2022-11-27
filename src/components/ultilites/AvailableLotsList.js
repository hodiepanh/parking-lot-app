import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AutoModeRoundedIcon from "@mui/icons-material/AutoModeRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import Tooltip from "@mui/material/Tooltip";
import default_image from "../../assets/default_image.png";

//import redux state management
import { useDispatch, useSelector } from "react-redux";
import {
  closeAlert,
  deleteParkingLotRex,
  openAlert,
  openNotification,
} from "../../redux/parkingLots";

//import router
import { useHistory } from "react-router-dom";

//import component
import AlertDialog from "./AlertDialog";
import Notification from "./Notification";

function AvailableLotsList({ lotsList, setLotsList }) {
  //const [openAlert, setOpenAlert] = useState(false);
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );

  //redux state management
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();

  //router
  const history = useHistory();

  //remove parking lot from list
  const removeLot = (index) => {
    //find parking lot with index !== chosen index ->update state
    const newList = lotsList.filter((item) => item.id !== index);
    setLotsList(newList);

    //remove from database
    dispatch(deleteParkingLotRex(index));
  };

  //navigate to result screen
  const runAuto = () => {
    if (standardImage == default_image) {
      dispatch(
        openNotification({
          status: "error",
          message: "Cannot run auto. Parking lot is not defined.",
        })
      );
    } else {
      history.push("/result");
    }
  };

  //navigate to calibration screen
  const adjust = (data) => {
    history.push(`/calib/${data.id}`);
  };

  //render list item
  const lotsMap = lotsList.map((data) => (
    <ListItem key={data.id} disablePadding>
      <ListItemButton>
        <ListItemText primary={data.title} />
        <div>
          <Tooltip title="Run Auto">
            <IconButton onClick={runAuto}>
              <AutoModeRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Adjust">
            <IconButton
              onClick={() => {
                adjust(data);
              }}
            >
              <TuneRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                dispatch(openAlert(""));
              }}
              aria-label="delete"
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
          <AlertDialog
            handleAnswer={() => {
              removeLot(data.id);
              dispatch(closeAlert());
            }}
          />
        </div>
      </ListItemButton>
    </ListItem>
  ));

  return (
    <div>
      <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <List component="nav" aria-label="secondary mailbox folder">
          {lotsMap}
        </List>
      </Box>
      <Notification />
    </div>
  );
}

export default AvailableLotsList;

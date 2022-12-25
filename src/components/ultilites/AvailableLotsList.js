import React, { useState } from "react";
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

//import redux state management
import { useDispatch, useSelector } from "react-redux";
import {
  deleteParkingLotRex,
  setReferenceImage,
  openAlert,
  openNotification,
} from "../../redux/parkingLots";

//import router
import { useHistory } from "react-router-dom";

//import component
import AlertDialog from "./AlertDialog";
import Notification from "./Notification";

//import style
import { styled } from "@mui/system";
const StyleList = styled(List)(({ theme }) => ({
  width: "100%",
  "& .MuiIconButton-root": {
    color: "white",
  },
}));

function AvailableLotsList({ lotsList, setLotsList }) {
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );

  //redux state management
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();

  //router
  const history = useHistory();

  //navigate to result screen
  const runAuto = (data) => {
    //only allow run auto if parking lot is defined - when standard image is not default
    if (!data.image) {
      dispatch(
        openNotification({
          status: "error",
          message: "Cannot run auto. Parking lot is not defined.",
        })
      );
    } else {
      history.push({
        pathname: `/result/${data.id}`,
        state: data.title,
      });
    }
  };

  //navigate to calibration screen
  const adjust = (data) => {
    history.push({
      pathname: `/calib/${data.id}`,
      state: data.title,
    });
  };

  //render list item
  const lotsMap = lotsList.map((data, index) => (
    <ListItem key={index} disablePadding>
      <ListItemButton>
        <ListItemText primary={data.title} />
        <div>
          <Tooltip title="Run Auto">
            <IconButton
              onClick={() => {
                runAuto(data);
              }}
            >
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
                dispatch(openAlert({ message: "", data: data }));
              }}
              aria-label="delete"
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
          <AlertDialog lotsList={lotsList} setLotsList={setLotsList} />
        </div>
      </ListItemButton>
    </ListItem>
  ));

  return (
    <div>
      <Box sx={{ width: "100vw", maxWidth: 300, bgcolor: "background.paper" }}>
        <StyleList component="nav" aria-label="secondary mailbox folder">
          {lotsMap}
        </StyleList>
      </Box>
      <Notification />
    </div>
  );
}

export default AvailableLotsList;

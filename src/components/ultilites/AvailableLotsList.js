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

//import redux state management
import { useDispatch, useSelector } from "react-redux";
import { deleteParkingLotRex } from "../../redux/parkingLots";

//import router
import { useHistory } from "react-router-dom";

//import component
import AlertDialog from "./AlertDialog";

function AvailableLotsList({ lotsList, setLotsList }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [answerAlert, setAnswerAlert] = useState(false);

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
    history.push("/result");
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
                setOpenAlert(true);
              }}
              aria-label="delete"
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
          <AlertDialog
            open={openAlert}
            setOpen={setOpenAlert}
            handleAnswer={() => {
              removeLot(data.id);
              setOpenAlert(false);
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
    </div>
  );
}

export default AvailableLotsList;

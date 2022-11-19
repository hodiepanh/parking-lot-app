import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteParkingLotRex, getParkingLot } from "../../redux/parkingLots";
import { useHistory } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AutoModeRoundedIcon from "@mui/icons-material/AutoModeRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import Tooltip from "@mui/material/Tooltip";
import AlertDialog from "./AlertDialog";
import { SettingsPowerRounded } from "@mui/icons-material";

function AvailableLotsList({ lotsList, setLotsList }) {
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();
  const history = useHistory();
  const [openAlert, setOpenAlert] = useState(false);
  const [answerAlert, setAnswerAlert] = useState(false);

  const handleAnswerAlert = () => {
    setAnswerAlert(true);
    setOpenAlert(false);
  };

  const removeLot = (index) => {
    //setOpenAlert(true);
    //console.log(index);
    const newList = lotsList.filter((item) => item.id !== index);
    setLotsList(newList);
    dispatch(deleteParkingLotRex(index));
  };

  useEffect(() => {
    //dispatch(getParkingLot());
    //console.log(lotsList);
  }, [lotsList]);

  const runAuto = () => {
    history.push("/result");
  };
  const adjust = (data) => {
    history.push(`/calib/${data.id}`);
  };

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
            //answer={answerAlert}
            //setAnswer={setAnswerAlert}
          />
        </div>
        {/* <Button
          onClick={() => {
            console.log(answerAlert);
          }}
        >
          Test
        </Button> */}

        {/* <Button
          onClick={() => {
            removeLot(data.id);
          }}
        >
          Clear
        </Button>
        <Button onClick={runAuto}>Run Auto</Button>
        <Button
          onClick={() => {
            adjust(data);
          }}
        >
          Adjust
        </Button> */}
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

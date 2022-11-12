import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../style/Home.css";
import { useHistory } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import { addParkingLot } from "../redux/parkingLots";
import DefineDialog from "../components/ultilites/DefineDialog";
import AutoOrAdjustDialog from "../components/ultilites/AutoOrAdjustDialog";

function Home() {
  const [openDefine, setOpenDefine] = React.useState(false);
  const [openAuto, setOpenAuto] = React.useState(false);
  const [openAdjust, setOpenAdjust] = React.useState(false);

  const history = useHistory();
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();

  const handleCloseDefine = () => {
    setOpenDefine(false);
    //console.log(defineName);
  };
  const handleToggleDefine = () => {
    setOpenDefine(!openDefine);
  };
  const handleCloseAuto = () => {
    setOpenAuto(false);
  };
  const handleToggleAuto = () => {
    setOpenAuto(!openAuto);
  };
  const handleCloseAdjust = () => {
    setOpenAdjust(false);
  };
  const handleToggleAdjust = () => {
    setOpenAdjust(!openAdjust);
  };
  const toReference = () => {
    history.push("calib");
    window.location.reload(false);
  };
  const toResult = () => {
    history.push("result");
    window.location.reload(false);
  };

  useEffect(() => {
    //console.log(parkingList);
    //dispatch(getParkingLot());
  });

  return (
    <div>
      <h1>WELCOME TO IMAGE CALIBRATION</h1>
      <h2>Select Functions</h2>
      <div className="button-wrapper">
        <Stack spacing={2} direction="column">
          <Button onClick={handleToggleDefine} variant="contained">
            Define New Parking Lot
          </Button>
          <Button onClick={handleToggleAuto} variant="contained">
            Process Parking Lot Auto
          </Button>
          <Button onClick={handleToggleAdjust} variant="contained">
            Adjust Parking Lot
          </Button>
        </Stack>
      </div>
      <DefineDialog open={openDefine} setOpen={setOpenDefine} />
      <AutoOrAdjustDialog open={openAuto} setOpen={setOpenAuto} mode="auto" />
      <AutoOrAdjustDialog
        open={openAdjust}
        setOpen={setOpenAdjust}
        mode="adjust"
      />
    </div>
  );
}

export default Home;

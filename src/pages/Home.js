import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../style/Home.css";
import { useHistory } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import { addParkingLot, getParkingLotRex } from "../redux/parkingLots";
import DefineDialog from "../components/ultilites/DefineDialog";
import AvailableLotsList from "../components/ultilites/AvailableLotsList";

function Home() {
  const [openDefine, setOpenDefine] = React.useState(false);
  const [openAuto, setOpenAuto] = React.useState(false);
  const [openAdjust, setOpenAdjust] = React.useState(false);

  const history = useHistory();
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const [lotsList, setLotsList] = useState([]);
  const dispatch = useDispatch();

  const handleToggleDefine = () => {
    setOpenDefine(!openDefine);
  };

  const test = () => {};

  useEffect(() => {
    dispatch(getParkingLotRex())
      .unwrap()
      .then((res) => {
        setLotsList(res);
        //console.log(res);
      });
  }, []);

  return (
    <div>
      <h1>WELCOME TO IMAGE CALIBRATION</h1>
      <h2>Select Functions</h2>
      {/* <Button onClick={test}>Test</Button> */}
      <div className="button-wrapper">
        <Stack spacing={2} direction="column">
          <Button onClick={handleToggleDefine} variant="contained">
            Define New Parking Lot
          </Button>
          <AvailableLotsList lotsList={lotsList} setLotsList={setLotsList} />
        </Stack>
      </div>
      <DefineDialog
        open={openDefine}
        setOpen={setOpenDefine}
        lotsList={lotsList}
        setLotsList={setLotsList}
      />
    </div>
  );
}

export default Home;

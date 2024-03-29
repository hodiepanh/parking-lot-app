import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import "../style/Home.css";
import { useHistory } from "react-router-dom";

//import state management
import { useSelector, useDispatch } from "react-redux";
import { getParkingLotRex, setActiveStep } from "../redux/parkingLots";

//import component
import DefineDialog from "../components/ultilites/DefineDialog";
import AvailableLotsList from "../components/ultilites/AvailableLotsList";
import LoadingOverlay from "../components/ultilites/LoadingOverlay";

function Home() {
  const [openDefine, setOpenDefine] = React.useState(false);
  const [lotsList, setLotsList] = useState([]);

  //redux state managament
  const parkingList = useSelector((state) => state.parkingReducer.value);
  const loading = useSelector((state) => state.parkingReducer.loading);
  const dispatch = useDispatch();

  //router
  const history = useHistory();

  //open Define Dialog
  const handleToggleDefine = () => {
    setOpenDefine(!openDefine);
  };

  //fetch data from database
  //set parking lots list as fetched data
  useEffect(() => {
    dispatch(setActiveStep(0));
    dispatch(getParkingLotRex())
      .unwrap()
      .then((res) => {
        setLotsList(res);
        //console.log(lotsList);
      });
  }, []);

  const errorHandler = () => {
    if (lotsList == undefined) {
      history.push("/error");
    }
  };

  return (
    <div className="page-wrapper">
      <Typography variant="h1">WELCOME TO IMAGE CALIBRATION</Typography>
      <LoadingOverlay open={loading} />
      <div className="button-wrapper">
        <Stack spacing={5} direction="column">
          <Button onClick={handleToggleDefine} variant="contained">
            Define New Parking Lot
          </Button>
          <AvailableLotsList
            loading={loading}
            lotsList={lotsList}
            setLotsList={setLotsList}
          />
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

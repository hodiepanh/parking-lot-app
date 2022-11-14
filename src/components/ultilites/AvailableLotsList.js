import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteParkingLotRex,
  getParkingLotRex,
  setParkingLot,
} from "../../redux/parkingLots";
import { useHistory } from "react-router-dom";

function AvailableLotsList({ lotsList, setLotsList }) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  //const parkingList = useSelector((state) => state.parkingReducer.value);
  const dispatch = useDispatch();
  const history = useHistory();
  //const [lotsList, setLotsList] = useState([]);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  //   useEffect(() => {
  //     // parkingApi.getParkingLot().then((res) => {
  //     //   setParkingListdb(res.data);
  //     //   dispatch(setParkingLot(res.data));
  //     // });
  //     dispatch(getParkingLotRex())
  //       .unwrap()
  //       .then((res) => {
  //         setLotsList(res);
  //         //console.log(res);
  //       });
  //   }, [parkingList]);

  const removeLot = (index) => {
    //console.log(index);
    const newList = lotsList.filter((item) => item.id !== index);
    setLotsList(newList);
    dispatch(deleteParkingLotRex(index));
  };

  const runAuto = (data) => {
    console.log(data.title);
    history.push("/result");
  };
  const adjust = (data) => {
    console.log(data.title);
    history.push(`/calib/${data.id}`);
  };

  const lotsMap = lotsList.map((data) => (
    <ListItem key={data.id} disablePadding>
      <ListItemButton>
        <ListItemText primary={data.title} />
        <Button
          onClick={() => {
            removeLot(data.id);
          }}
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            runAuto(data);
          }}
        >
          Run Auto
        </Button>
        <Button
          onClick={() => {
            adjust(data);
          }}
        >
          Adjust
        </Button>
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

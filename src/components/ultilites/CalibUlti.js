import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import {
  editLandmarkRex,
  editSlotRex,
  setReferenceImage,
  openNotification,
} from "../../redux/parkingLots";

//import router
import { useHistory, useParams } from "react-router-dom";

//import component
import DrawMode from "./DrawMode";

//import style
import "../../style/ultilities.css";
import { styled } from "@mui/system";
const StyleList = styled(List)(({ theme }) => ({
  backgroundColor: "#878787",
  "& .MuiListSubheader-root": {
    backgroundColor: "#878787",
    color: "white",
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  "& .MuiIconButton-root": {
    color: "white",
  },
}));

function CalibUlti({
  landmarkList,
  parkingslotList,
  drawMode,
  setDrawMode,
  removeLandmark,
  removeSlot,
  image,
  inputFile,
  handleChange,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  //router
  const history = useHistory();
  const { id } = useParams();

  //render landmark list item
  const landmarkMap = landmarkList.map((data, index) => (
    <ListItem key={index} disablePadding>
      <ListItemButton>
        {/* <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="demo-simple-select-label">Index</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={index[data.id]}
              label="Id"
              autoWidth
              onChange={(event) => {
                handleIndex(event, data.id);
              }}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
        </Box> */}
        <ListItemText
          primary={`${index}: (${data.x1}, ${data.y1}), (${data.x2}, ${data.y2})`}
        />
        <IconButton
          aria-label="delete"
          onClick={() => {
            removeLandmark(data);
          }}
        >
          <CloseIcon color="white" />
        </IconButton>
      </ListItemButton>
    </ListItem>
  ));

  //render parking slot list item
  const parkingslotMap = parkingslotList.map((data, index) => (
    <ListItem key={index} disablePadding>
      <ListItemButton>
        <ListItemText
          primary={`${data.x1}, ${data.y1}, ${data.x2}, ${data.y2}`}
        />
        <IconButton
          aria-label="delete"
          onClick={() => {
            removeSlot(data);
          }}
        >
          <CloseIcon color="white" />
        </IconButton>
      </ListItemButton>
    </ListItem>
  ));

  //save data to the database
  const saveData = () => {
    //only save data to database if there are 4 landmarks
    if (landmarkList.length !== 4) {
      dispatch(
        openNotification({
          status: "error",
          message: "Only 4 landmarks.",
        })
      );
    } else {
      //save to database -> send success notification
      dispatch(editLandmarkRex({ id, landmarkList }));
      dispatch(editSlotRex({ id, parkingslotList }));
      dispatch(
        openNotification({
          status: "success",
          message: "Data saved successfully",
        })
      );
    }
  };

  return (
    <div className="ulti-wrapper">
      <Box
        sx={{
          // width: "100%",
          maxWidth: 360,
        }}
      >
        <Typography
          variant="h2"
          style={{ lineHeight: 0, textAlign: "left", marginBottom: 30 }}
        >
          Data store
        </Typography>
        <StyleList
          sx={{
            width: "100%",
            maxWidth: 360,
            position: "relative",
            overflow: "auto",
            height: 200,
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          <ListSubheader>Landmarks</ListSubheader>
          {landmarkMap}
          <ListSubheader>Parking Slots</ListSubheader>
          {parkingslotMap}
        </StyleList>
        <DrawMode mode={drawMode} setMode={setDrawMode} />
        <div className="button-wrapper">
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={saveData}>
              Save
            </Button>
            <Button
              variant="contained"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Upload
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  inputFile.current.click();
                }}
              >
                Browse
              </MenuItem>
              <MenuItem onClick={handleClose}>Cam Capture</MenuItem>
            </Menu>
            <input
              type="file"
              onChange={handleChange}
              ref={inputFile}
              style={{ display: "none" }}
            />
          </Stack>
        </div>
      </Box>
    </div>
  );
}

export default CalibUlti;

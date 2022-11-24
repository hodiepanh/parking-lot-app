import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../style/Calib.css";

//import redux state management
import { useSelector, useDispatch } from "react-redux";
import {
  editLandmarkRex,
  editSlotRex,
  setReferenceImage,
} from "../redux/parkingLots";

//import router
import { useHistory, useParams } from "react-router-dom";

//import component
import DrawMode from "../components/ultilites/DrawMode";
import Notification from "../components/ultilites/Notification";

function Calib() {
  const [drawing, setDrawing] = useState(false);
  const [mode, setMode] = useState("");

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const canvasOffsetX = useRef(null);
  const canvasOffsetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  //landmark and parking slots list
  const [landmarkList, setLandmarkList] = useState([]);
  const [parkingslotList, setParkingSlotList] = useState([]);

  //image in canvas
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );
  const inputFile = useRef(null);
  const [refImage, setRefImage] = useState(standardImage);
  const dispatch = useDispatch();

  //router
  const history = useHistory();
  const { id } = useParams();

  //notification
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [openNoti, setOpenNoti] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const canvasOffset = canvas.getBoundingClientRect();
    canvasOffsetX.current = canvasOffset.left;
    canvasOffsetY.current = canvasOffset.top;
  }, [mode]);

  //set image in canvas from local storage
  const handleChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    //cannot access file path -> upload image to temp cache
    file.preview = URL.createObjectURL(file);
    setRefImage(file.preview);
  };

  const handleCloseNoti = () => {
    setOpenNoti(false);
  };

  const setNotiProp = (open, status, message) => {
    setOpenNoti(open);
    setStatus(status);
    setMessage(message);
  };

  //const [index, setIndex] = React.useState([1, 2, 3, 4]);
  //var index = [1, 2, 3, 4];

  // const handleIndex = (event, item_index) => {
  //   //console.log(item_index);
  //   //console.log(event.target.value);
  //   if (item_index == 0) {
  //     setIndex([event.target.value, index[1], index[2], index[3]]);
  //   }
  //   if (item_index == 1) {
  //     setIndex([index[0], event.target.value, index[2], index[3]]);
  //   }
  //   if (item_index == 2) {
  //     setIndex([index[0], index[1], event.target.value, index[3]]);
  //   }
  //   if (item_index == 3) {
  //     setIndex([index[0], index[1], index[2], event.target.value]);
  //   }
  //   //index[item_index] = event.target.value;
  //   console.log(index);
  // };

  //get coordinate start point of rectangle
  const startRect = ({ nativeEvent }) => {
    if (refImage == standardImage) {
      //alert("choose the reference image first");
    } else {
      if (mode == "") {
      } else {
        startX.current = nativeEvent.clientX - canvasOffsetX.current;
        startY.current = nativeEvent.clientY - canvasOffsetY.current;

        setDrawing(true);
      }
    }
  };

  const trackRect = ({ nativeEvent }) => {
    if (!drawing) {
      return;
    }
    //nativeEvent.preventDefault();
    //nativeEvent.stopPropagation();

    // const newMouseX = nativeEvent.clientX - canvasOffsetX.current;
    // const newMouseY = nativeEvent.clientY - canvasOffsetY.current;

    // const rectWidth = newMouseX - startX.current;
    // const rectHeight = newMouseY - startY.current;

    // contextRef.current.clearRect(
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );

    // contextRef.current.strokeRect(
    //   startX.current,
    //   startY.current,
    //   rectWidth,
    //   rectHeight
    // );

    //console.log(nativeEvent.clientX, nativeEvent.clientY);
  };

  //get coordinate end point of rectangle
  const endRect = ({ nativeEvent }) => {
    if (refImage == standardImage) {
      setNotiProp(true, "error", "Choose the reference image first");
    } else {
      if (mode == "") {
        setNotiProp(true, "error", "Choose the drawing mode first");
      } else {
        const newMouseX = nativeEvent.clientX - canvasOffsetX.current;
        const newMouseY = nativeEvent.clientY - canvasOffsetY.current;

        const rectWidth = newMouseX - startX.current;
        const rectHeight = newMouseY - startY.current;

        //draw
        if (mode == "landmark") {
          contextRef.current.strokeStyle = "red";
        } else {
          contextRef.current.strokeStyle = "black";
        }
        contextRef.current.strokeRect(
          startX.current,
          startY.current,
          rectWidth,
          rectHeight
        );

        //update data list
        if (mode == "landmark") {
          setLandmarkList((prevState) => [
            ...prevState,
            {
              id: landmarkList.length,
              x1: Math.round(startX.current),
              y1: Math.round(startY.current),
              x2: Math.round(startX.current + rectWidth),
              y2: Math.round(startY.current + rectHeight),
            },
          ]);
          console.log(landmarkList);
        }
        if (mode == "slot") {
          setParkingSlotList((prevState) => [
            ...prevState,
            {
              id: parkingslotList.length,
              x1: Math.round(startX.current),
              y1: Math.round(startY.current),
              x2: Math.round(startX.current + rectWidth),
              y2: Math.round(startY.current + rectHeight),
            },
          ]);
        }

        setDrawing(false);
      }
    }
  };

  //remove landmark in list -> erase landmark in canvas
  const removeLandmarkData = (index) => {
    const removeRect = landmarkList.filter((item) => item.id == index);
    const newList = landmarkList.filter((item) => item.id !== index);
    setLandmarkList(newList);

    contextRef.current.clearRect(
      removeRect[0].x1 - 1,
      removeRect[0].y1 - 1,
      removeRect[0].x2 - removeRect[0].x1 + 2,
      removeRect[0].y2 - removeRect[0].y1 + 2
    );
  };

  //remove parking slot in list -> erase parking slot in canvas
  const removeSlotData = (index) => {
    const removeRect = parkingslotList.filter((item) => item.id == index);
    const newList = parkingslotList.filter((item) => item.id !== index);
    setParkingSlotList(newList);

    contextRef.current.clearRect(
      removeRect[0].x1 - 1,
      removeRect[0].y1 - 1,
      removeRect[0].x2 - removeRect[0].x1 + 2,
      removeRect[0].y2 - removeRect[0].y1 + 2
    );
  };

  //render landmark list item
  const landmarkMap = landmarkList.map((data) => (
    <ListItem key={data.id} disablePadding>
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
          primary={`${data.id}: (${data.x1}, ${data.y1}), (${data.x2}, ${data.y2})`}
        />
        <Button
          onClick={() => {
            removeLandmarkData(data.id);
          }}
        >
          Clear
        </Button>
      </ListItemButton>
    </ListItem>
  ));

  //render parking slot list item
  const parkingslotMap = parkingslotList.map((data) => (
    <ListItem key={data.id} disablePadding>
      <ListItemButton>
        <ListItemText
          primary={`${data.x1}, ${data.y1}, ${data.x2}, ${data.y2}`}
        />
        <Button
          onClick={() => {
            removeSlotData(data.id);
          }}
        >
          Clear
        </Button>
      </ListItemButton>
    </ListItem>
  ));

  //const [newLandmarkList, setNewLandmarkList] = useState([]);
  //save data to the database
  const saveData = () => {
    if (landmarkList.length !== 4) {
      setNotiProp(true, "error", "Only 4 landmarks");
    } else {
      // var newLandmarkList = [];
      // for (let i = 0; i < index.length; i++) {
      //   newLandmarkList.push({
      //     id: landmarkList[i].id,
      //     index: index[i],
      //     x1: landmarkList[i].x1,
      //     y1: landmarkList[i].y1,
      //     x2: landmarkList[i].x2,
      //     y2: landmarkList[i].y2,
      //   });
      // }
      // setLandmarkList(newLandmarkList);
      // console.log(landmarkList);
      dispatch(editLandmarkRex({ id, landmarkList }));
      dispatch(editSlotRex({ id, parkingslotList }));
      setNotiProp(true, "success", "Data saved successfully");
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //navigate to result screen
  const toResult = () => {
    dispatch(setReferenceImage(refImage));
    history.push("/result");
  };

  return (
    <div className="view">
      <h1>DEFINE PARKING LOT</h1>
      <div className="layout">
        <div className="image-editor">
          <canvas
            className="image"
            id="canvas"
            style={{
              backgroundImage: `url('${refImage}')`,
            }}
            ref={canvasRef}
            width="600"
            height="400"
            onMouseDown={startRect}
            //onMouseMove={trackRect}
            onMouseUp={endRect}
          ></canvas>
        </div>

        <div className="data-list">
          <Box
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            <h3>Data storage</h3>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                height: 200,
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              {/* {[0, 1, 2, 3, 4].map((sectionId) => (
                <li key={`section-${sectionId}`}>
                  <ul>
                    <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                    {[0, 1, 2].map((item) => (
                      <ListItem key={`item-${sectionId}-${item}`}>
                        <ListItemText primary={`Item ${item}`} />
                      </ListItem>
                    ))}
                  </ul>
                </li>
              ))} */}
              <ListSubheader>Landmarks</ListSubheader>
              {landmarkMap}
              <ListSubheader>Parking Slots</ListSubheader>
              {parkingslotMap}
            </List>
            <DrawMode mode={mode} setMode={setMode} />
            <div className="button-wrapper">
              <Stack spacing={2} direction="row">
                <Button onClick={toResult} variant="text">
                  Next
                </Button>
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
      </div>

      <Notification
        severity={status}
        message={message}
        open={openNoti}
        handleClose={handleCloseNoti}
      />
    </div>
  );
}

export default Calib;

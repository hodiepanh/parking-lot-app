import React, { useState, useRef, useEffect } from "react";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
// import ButtonGroup from "@mui/material/ButtonGroup";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
// import ListSubheader from "@mui/material/ListSubheader";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import InputLabel from "@mui/material/InputLabel";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import CloseIcon from "@mui/icons-material/Close";
// import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CalibUlti from "../components/ultilites/CalibUlti";

import "../style/Calib.css";

//import redux state management
import { useSelector, useDispatch } from "react-redux";
import {
  // editLandmarkRex,
  // editSlotRex,
  setReferenceImage,
  openNotification,
} from "../redux/parkingLots";

//import router
import { useHistory, useParams } from "react-router-dom";

//import component
//import DrawMode from "../components/ultilites/DrawMode";
import Notification from "../components/ultilites/Notification";

//import style
// import { styled } from "@mui/system";
// const StyleList = styled(List)(({ theme }) => ({
//   backgroundColor: "#878787",
//   "& .MuiListSubheader-root": {
//     backgroundColor: "#878787",
//     color: "white",
//     textAlign: "left",
//     textTransform: "uppercase",
//     letterSpacing: "0.1em",
//   },
//   "& .MuiIconButton-root": {
//     color: "white",
//   },
// }));

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

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [anchor, setAnchor] = useState("right");

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ [anchor]: open });
  };

  const ulti = (anchor) => (
    <CalibUlti
      landmarkList={landmarkList}
      parkingslotList={parkingslotList}
      drawMode={mode}
      setDrawMode={setMode}
      removeLandmark={removeLandmarkData}
      removeSlot={removeSlotData}
      image={refImage}
      inputFile={inputFile}
      handleChange={handleChange}
    />
  );
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
      dispatch(
        openNotification({
          status: "error",
          message: "Choose the reference image first",
        })
      );
    } else {
      if (mode == "") {
        dispatch(
          openNotification({
            status: "error",
            message: "Choose the drawing mode first",
          })
        );
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
              //id: landmarkList.length,
              x1: Math.round(startX.current),
              y1: Math.round(startY.current),
              x2: Math.round(startX.current + rectWidth),
              y2: Math.round(startY.current + rectHeight),
            },
          ]);
          //console.log(landmarkList);
        }
        if (mode == "slot") {
          setParkingSlotList((prevState) => [
            ...prevState,
            {
              //id: parkingslotList.length,
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
  const removeLandmarkData = (data) => {
    const removeRect = landmarkList.filter((item) => item == data);
    //console.log(removeRect);
    const newList = landmarkList.filter((item) => item !== data);
    setLandmarkList(newList);
    contextRef.current.clearRect(
      removeRect[0].x1 - 1,
      removeRect[0].y1 - 1,
      removeRect[0].x2 - removeRect[0].x1 + 2,
      removeRect[0].y2 - removeRect[0].y1 + 2
    );
  };

  //remove parking slot in list -> erase parking slot in canvas
  const removeSlotData = (data) => {
    const removeRect = parkingslotList.filter((item) => item == data);
    const newList = parkingslotList.filter((item) => item !== data);
    setParkingSlotList(newList);
    contextRef.current.clearRect(
      removeRect[0].x1 - 1,
      removeRect[0].y1 - 1,
      removeRect[0].x2 - removeRect[0].x1 + 2,
      removeRect[0].y2 - removeRect[0].y1 + 2
    );
  };

  //render landmark list item
  // const landmarkMap = landmarkList.map((data, index) => (
  //   <ListItem key={index} disablePadding>
  //     <ListItemButton>
  //       {/* <Box sx={{ minWidth: 120 }}>
  //         <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
  //           <InputLabel id="demo-simple-select-label">Index</InputLabel>
  //           <Select
  //             labelId="demo-simple-select-label"
  //             id="demo-simple-select"
  //             value={index[data.id]}
  //             label="Id"
  //             autoWidth
  //             onChange={(event) => {
  //               handleIndex(event, data.id);
  //             }}
  //           >
  //             <MenuItem value={1}>1</MenuItem>
  //             <MenuItem value={2}>2</MenuItem>
  //             <MenuItem value={3}>3</MenuItem>
  //             <MenuItem value={4}>4</MenuItem>
  //           </Select>
  //         </FormControl>
  //       </Box> */}
  //       <ListItemText
  //         primary={`${index}: (${data.x1}, ${data.y1}), (${data.x2}, ${data.y2})`}
  //       />
  //       <IconButton
  //         aria-label="delete"
  //         onClick={() => {
  //           removeLandmarkData(data);
  //         }}
  //       >
  //         <CloseIcon color="white" />
  //       </IconButton>
  //     </ListItemButton>
  //   </ListItem>
  // ));

  //render parking slot list item
  // const parkingslotMap = parkingslotList.map((data, index) => (
  //   <ListItem key={index} disablePadding>
  //     <ListItemButton>
  //       <ListItemText
  //         primary={`${data.x1}, ${data.y1}, ${data.x2}, ${data.y2}`}
  //       />
  //       <IconButton
  //         aria-label="delete"
  //         onClick={() => {
  //           removeSlotData(data);
  //         }}
  //       >
  //         <CloseIcon color="white" />
  //       </IconButton>
  //     </ListItemButton>
  //   </ListItem>
  // ));

  //save data to the database
  // const saveData = () => {
  //   if (landmarkList.length !== 4) {
  //     dispatch(
  //       openNotification({
  //         status: "error",
  //         message: "Only 4 landmarks.",
  //       })
  //     );
  //   } else {
  //     dispatch(editLandmarkRex({ id, landmarkList }));
  //     dispatch(editSlotRex({ id, parkingslotList }));
  //     dispatch(
  //       openNotification({
  //         status: "success",
  //         message: "Data saved successfully",
  //       })
  //     );
  //   }
  // };

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  //navigate to result screen
  const toResult = () => {
    if (landmarkList.length != 4) {
      dispatch(
        openNotification({
          status: "error",
          message: "Cannot show result. Landmarks are not defined.",
        })
      );
    } else {
      dispatch(setReferenceImage(refImage));
      history.push("/result");
    }
  };

  return (
    <div className="view">
      <Typography variant="h1">Define parking lot</Typography>
      <div className="layout">
        <div className="image-editor">
          <canvas
            className="image"
            id="canvas"
            style={{
              backgroundImage: `url('${refImage}')`,
              cursor: "crosshair",
              caretColor: "yellow",
            }}
            ref={canvasRef}
            width="600"
            height="400"
            onMouseDown={startRect}
            //onMouseMove={trackRect}
            onMouseUp={endRect}
          ></canvas>
        </div>
        <div className="ulti-wrapper">
          <div className="drawer">
            <React.Fragment key={anchor}>
              <Button variant="contained" onClick={toggleDrawer(anchor, true)}>
                Menu
              </Button>
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {ulti(anchor)}
              </Drawer>
            </React.Fragment>
            {/* <Button onClick={toResult}>Next</Button> */}
          </div>
          <div className="data-list">
            <CalibUlti
              landmarkList={landmarkList}
              parkingslotList={parkingslotList}
              drawMode={mode}
              setDrawMode={setMode}
              removeLandmark={removeLandmarkData}
              removeSlot={removeSlotData}
              image={refImage}
              inputFile={inputFile}
              handleChange={handleChange}
            />
            {/* <Box
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="h2"
              style={{ lineHeight: 0, textAlign: "top", marginBottom: 30 }}
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
          </Box> */}
          </div>
          <Button variant="outlined" onClick={toResult}>
            Next
          </Button>
        </div>
      </div>
      <Notification />
    </div>
  );
}

export default Calib;

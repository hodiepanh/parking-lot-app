import React, { useState, useRef, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CalibUlti from "../components/ultilites/CalibUlti";
import default_image from "../assets/default_image.png";

import "../style/Calib.css";

//import redux state management
import { useSelector, useDispatch } from "react-redux";
import {
  editImageRex,
  editCalibratedRex,
  setReferenceImage,
  openNotification,
} from "../redux/parkingLots";

//import router
import { useHistory, useParams } from "react-router-dom";

//import component
import Notification from "../components/ultilites/Notification";
import axios from "axios";

function Calib() {
  const imageWidthRatio = 1920 / 600;
  const imageHeightRatio = 1080 / 400;
  //canvasWidth = 600
  //canvasHeight = 400

  const [drawing, setDrawing] = useState(false);
  const [mode, setMode] = useState("");
  const [saved, setSaved] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const canvasOffsetX = useRef(null);
  const canvasOffsetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  //landmark and parking slots list
  const [landmarkList, setLandmarkList] = useState([]);
  const [parkingslotList, setParkingSlotList] = useState([]);

  //image in canvas;
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );

  const parkinglotValue = useSelector((state) => state.parkingReducer.value);

  const inputFile = useRef(null);
  const [refImage, setRefImage] = useState(standardImage);

  const [saveImage, setSaveImage] = useState("");
  const dispatch = useDispatch();

  //router
  const history = useHistory();
  const { id } = useParams();
  const [title, setTitle] = useState(history.location.state);

  //setup drawer
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

  //drawer content
  const ulti = (anchor) => (
    <CalibUlti
      landmarkList={landmarkList}
      parkingslotList={parkingslotList}
      drawMode={mode}
      setDrawMode={setMode}
      removeLandmark={removeLandmarkData}
      removeSlot={removeSlotData}
      imageRef={refImage}
      image={saveImage}
      inputFile={inputFile}
      handleChange={handleChange}
      saved={saved}
      setSaved={setSaved}
    />
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const canvasOffset = canvas.getBoundingClientRect();
    canvasOffsetX.current = canvasOffset.left;
    canvasOffsetY.current = canvasOffset.top;

    try {
      setRefImage(require(`../assets/Reference/${id}.jpg`));
    } catch (err) {
      setRefImage(standardImage);
    }
  }, []);

  //set image in canvas from local storage
  const handleChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    //cannot access file path -> upload image to temp cache
    setSaveImage(event.target.files[0]);

    file.preview = URL.createObjectURL(file);
    setRefImage(file.preview);
  };

  //test image upload
  //const [file, setFile] = useState();
  //const [description, setDescription] = useState("");
  //const [image, setImage] = useState();

  // const uploadImage = async () => {
  //   // event.preventDefault();

  //   const formData = new FormData();
  //   formData.append("image", saveImage);
  //   //formData.append("description", description);

  //   const result = await axios.post(
  //     "http://localhost:5000/parkinglots/upload",
  //     formData,
  //     {
  //       headers: {
  //         "Access-Control-Allow-Origin": "*",
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   //setImage(result.data.imagePath);
  // };

  const uploadImage = () => {
    const formData = new FormData();
    formData.append("image", saveImage);
    dispatch(editImageRex({ id, formData }));
  };

  const calibrateImage = () => {
    const formData = new FormData();
    formData.append("image", saveImage);
    dispatch(editCalibratedRex({ id, title }));
  };
  //draw rectangle with only one click
  const clickRect = ({ nativeEvent }) => {
    if (refImage == default_image) {
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
        const center_x = nativeEvent.clientX - canvasOffsetX.current;
        const center_y = nativeEvent.clientY - canvasOffsetY.current;
        //const newMouseX = nativeEvent.clientX - canvasOffsetX.current;
        //const newMouseY = nativeEvent.clientY - canvasOffsetY.current;

        //const rectWidth = newMouseX - startX.current;
        //const rectHeight = newMouseY - startY.current;
        const rectWidth = 30;
        const rectHeight = 30;

        const start_x = center_x - rectWidth / 2;
        const start_y = center_y - rectHeight / 2;

        const start_x_data = start_x * imageWidthRatio;
        const start_y_data = start_y * imageHeightRatio;

        //draw
        if (mode == "landmark") {
          contextRef.current.strokeStyle = "red";
        } else {
          contextRef.current.strokeStyle = "black";
        }
        contextRef.current.strokeRect(start_x, start_y, rectWidth, rectHeight);

        //update data list
        if (mode == "landmark") {
          setLandmarkList((prevState) => [
            ...prevState,
            {
              //id: landmarkList.length,
              x1: Math.round(start_x * imageWidthRatio),
              y1: Math.round(start_y * imageHeightRatio),
              x2: Math.round((start_x + rectWidth) * imageWidthRatio),
              y2: Math.round((start_y + rectHeight) * imageHeightRatio),
            },
          ]);
          //console.log(landmarkList);
        }
        if (mode == "slot") {
          setParkingSlotList((prevState) => [
            ...prevState,
            {
              //id: parkingslotList.length,
              x1: Math.round(start_x),
              y1: Math.round(start_y),
              x2: Math.round(start_x + rectWidth),
              y2: Math.round(start_y + rectHeight),
            },
          ]);
        }

        setDrawing(false);
      }
    }
  };
  //get coordinate start point of rectangle
  const startRect = ({ nativeEvent }) => {
    if (refImage == default_image) {
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
    if (refImage == default_image) {
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

  const drawRect = ({ nativeEvent }) => {
    if (mode == "landmark") {
      clickRect({ nativeEvent });
    }
    if (mode == "slot") {
      endRect({ nativeEvent });
    }
  };

  //remove landmark in list -> erase landmark in canvas
  const removeLandmarkData = (data) => {
    const removeRect = landmarkList.filter((item) => item == data);
    const newList = landmarkList.filter((item) => item !== data);
    setLandmarkList(newList);

    //erase in canvas
    if (mode == "landmark") {
      contextRef.current.clearRect(
        removeRect[0].x1 / imageWidthRatio - 1,
        removeRect[0].y1 / imageHeightRatio - 1,
        (removeRect[0].x2 - removeRect[0].x1) / imageWidthRatio + 2,
        (removeRect[0].y2 - removeRect[0].y1) / imageHeightRatio + 2
      );
    }
    if (mode == "slot") {
      contextRef.current.clearRect(
        removeRect[0].x1 - 1,
        removeRect[0].y1 - 1,
        removeRect[0].x2 - removeRect[0].x1 + 2,
        removeRect[0].y2 - removeRect[0].y1 + 2
      );
    }
  };

  //remove parking slot in list -> erase parking slot in canvas
  const removeSlotData = (data) => {
    const removeRect = parkingslotList.filter((item) => item == data);
    const newList = parkingslotList.filter((item) => item !== data);
    setParkingSlotList(newList);

    //erase in canvas
    contextRef.current.clearRect(
      removeRect[0].x1 - 1,
      removeRect[0].y1 - 1,
      removeRect[0].x2 - removeRect[0].x1 + 2,
      removeRect[0].y2 - removeRect[0].y1 + 2
    );
  };

  //navigate to result screen
  const toResult = () => {
    //only navigate if parking is already defined (data exist in db)
    //or only navigate if parking defined this time
    if (refImage == default_image) {
      dispatch(
        openNotification({
          status: "error",
          message: "Landmarks are not saved to databased.",
        })
      );
    } else {
      //set image in Result Screen
      dispatch(setReferenceImage(`${id}.jpg`));
      //calibrate image
      const formData = new FormData();
      formData.append("image", saveImage);
      dispatch(editCalibratedRex({ id, title }))
        .unwrap()
        .then(() => {
          //go to result when calibrate is success
          //history.push({ pathname: `/result/${id}`, state: title });
        });
    }
  };

  const test = () => {
    console.log(saveImage);
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
              //backgroundImage: `url(${require("../assets/Parking Lots/Sample lot/lmTst_9.jpg")})`,
              backgroundImage: `url('${refImage}')`,
              cursor: "crosshair",
            }}
            ref={canvasRef}
            width="600"
            height="400"
            onMouseDown={startRect}
            //onMouseMove={trackRect}
            onMouseUp={drawRect}
          ></canvas>
          <div className="data-list">
            <CalibUlti
              landmarkList={landmarkList}
              parkingslotList={parkingslotList}
              drawMode={mode}
              setDrawMode={setMode}
              removeLandmark={removeLandmarkData}
              removeSlot={removeSlotData}
              imageRef={refImage}
              image={saveImage}
              inputFile={inputFile}
              handleChange={handleChange}
              saved={saved}
              setSaved={setSaved}
            />
            <div className="next-button-full">
              <Button variant="outlined" onClick={toResult}>
                Next
              </Button>
              {/* <Button variant="outlined" onClick={uploadImage}>
                Upload
              </Button> */}
            </div>
          </div>
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
          </div>
          <div className="next-button-small">
            <Button variant="outlined" onClick={toResult}>
              Next
            </Button>
            {/* <Button variant="outlined" onClick={uploadImage}>
              Upload
            </Button> */}
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}

export default Calib;

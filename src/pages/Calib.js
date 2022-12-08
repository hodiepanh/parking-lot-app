import React, { useState, useRef, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CalibUlti from "../components/ultilites/CalibUlti";

import "../style/Calib.css";

//import redux state management
import { useSelector, useDispatch } from "react-redux";
import {
  editImageRex,
  setReferenceImage,
  setResultImage,
  openNotification,
} from "../redux/parkingLots";

//import router
import { useHistory, useParams } from "react-router-dom";

//import component
import Notification from "../components/ultilites/Notification";
import axios from "axios";

function Calib() {
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

  //image in canvas
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );

  const parkinglotValue = useSelector((state) => state.parkingReducer.value);
  //console.log(parkinglotValue);
  const inputFile = useRef(null);
  const [refImage, setRefImage] = useState(standardImage);
  const [saveImage, setSaveImage] = useState("");
  const dispatch = useDispatch();

  //console.log(refImage);
  //router
  const history = useHistory();
  const { id } = useParams();

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
      image={refImage}
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
  }, [mode]);

  //set image in canvas from local storage
  const handleChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    //cannot access file path -> upload image to temp cache
    setSaveImage(event.target.files[0]);

    //console.log(saveImage);
    //console.log(event.target.files[0]);
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
    const newList = landmarkList.filter((item) => item !== data);
    setLandmarkList(newList);

    //erase in canvas
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
    //only navigate if there are 4 landmarks
    if (saved == false) {
      dispatch(
        openNotification({
          status: "error",
          message: "Landmarks are not saved to databased.",
        })
      );
    }
    // if (landmarkList.length != 4) {
    //   dispatch(
    //     openNotification({
    //       status: "error",
    //       message: "Cannot show result. Landmarks are not defined.",
    //     })
    //   );
    // }
    else {
      //set image in Result Screen
      //dispatch(setReferenceImage(`${id}_${saveImage.name}`));
      dispatch(setResultImage(refImage));
      //console.log(`${id}_${saveImage.name}`);
      //console.log(refImage);
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
              //backgroundImage: `url(${require("../assets/Parking Lots/Sample lot/lmTst_9.jpg")})`,
              backgroundImage: `url('${refImage}')`,
              cursor: "crosshair",
            }}
            ref={canvasRef}
            width="600"
            height="400"
            onMouseDown={startRect}
            //onMouseMove={trackRect}
            onMouseUp={endRect}
          ></canvas>
          <div className="data-list">
            <CalibUlti
              landmarkList={landmarkList}
              parkingslotList={parkingslotList}
              drawMode={mode}
              setDrawMode={setMode}
              removeLandmark={removeLandmarkData}
              removeSlot={removeSlotData}
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
              <Button variant="outlined" onClick={uploadImage}>
                Upload
              </Button>
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
            <Button variant="outlined" onClick={uploadImage}>
              Upload
            </Button>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}

export default Calib;

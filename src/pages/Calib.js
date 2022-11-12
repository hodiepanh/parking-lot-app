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
import "../style/Calib.css";
import { useHistory } from "react-router-dom";
import default_image from "../assets/default_image.png";
import test_image from "../assets/Parking Lots/Sample lot/lmTst_0.jpg";
import { useSelector, useDispatch } from "react-redux";
import { setReferenceImage } from "../redux/parkingLots";

function Calib() {
  const [reference, setReference] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [image, setImage] = useState([]);

  const [rect, setRect] = useState([]);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const canvasOffsetX = useRef(null);
  const canvasOffsetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  const [dataList, setDataList] = useState([]);

  const history = useHistory();
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );

  const [file, setFile] = useState();
  const inputFile = useRef(null);
  const [refImage, setRefImage] = useState(standardImage);
  const dispatch = useDispatch();

  useEffect(() => {
    const img = new Image(); // Create new img element
    img.src =
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"; // Set source path

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const canvasOffset = canvas.getBoundingClientRect();
    canvasOffsetX.current = canvasOffset.left;
    canvasOffsetY.current = canvasOffset.top;

    //console.log(standardImage);

    // img.onload = () => {
    //   setImage(img);
    //   context.drawImage(img, 0, 0);
    // };
    //console.log(canvasOffset);
  });

  //useEffect if want to clear temp cache

  const handleChange = (event) => {
    // setFile([...file, event.target.files[0]]);
    //console.log(event.target.value);
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    //setFile(fileObj.name);
    //console.log(inputFile);
    file.preview = URL.createObjectURL(file);
    setRefImage(file.preview);
    //dispatch(setReferenceImage(refImage));
    //console.log(file.preview);
  };

  const startRect = ({ nativeEvent }) => {
    //nativeEvent.preventDefault();
    //nativeEvent.stopPropagation();
    //setRect([event.clientX, event.clientY]);
    //console.log(event.clientX, event.clientY);
    startX.current = nativeEvent.clientX - canvasOffsetX.current;
    startY.current = nativeEvent.clientY - canvasOffsetY.current;

    setDrawing(true);
    //return x1,y1;
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

  const endRect = ({ nativeEvent }) => {
    //setRect((prevState) => [...prevState, event.clientX, event.clientY]);
    //console.log(event.clientX, event.clientY);
    //console.log(rect);
    const newMouseX = nativeEvent.clientX - canvasOffsetX.current;
    const newMouseY = nativeEvent.clientY - canvasOffsetY.current;

    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;
    // contextRef.current.clearRect(
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );

    contextRef.current.strokeRect(
      startX.current,
      startY.current,
      rectWidth,
      rectHeight
    );

    setDataList((prevState) => [
      ...prevState,
      {
        id: dataList.length,
        x1: Math.round(startX.current),
        y1: Math.round(startY.current),
        x2: Math.round(startX.current + rectWidth),
        y2: Math.round(startY.current + rectHeight),
      },
    ]);
    setDrawing(false);
  };

  const back = () => {
    history.push("/reference");
    window.location.reload(false);
  };
  const toResult = () => {
    dispatch(setReferenceImage(refImage));
    history.push("/result");
    //window.location.reload(false);
  };

  const removeData = (index) => {
    const removeRect = dataList.filter((item) => item.id == index);
    const newList = dataList.filter((item) => item.id !== index);
    setDataList(newList);
    //console.log(removeRect[0].x1);

    contextRef.current.clearRect(
      removeRect[0].x1 - 1,
      removeRect[0].y1 - 1,
      removeRect[0].x2 - removeRect[0].x1 + 2,
      removeRect[0].y2 - removeRect[0].y1 + 2
    );
  };

  const dataMap = dataList.map((data) => (
    <ListItem key={data.id} disablePadding>
      <ListItemButton>
        <ListItemText
          primary={`${data.x1}, ${data.y1}, ${data.x2}, ${data.y2}`}
        />
        <Button
          onClick={() => {
            removeData(data.id);
          }}
        >
          Clear
        </Button>
      </ListItemButton>
    </ListItem>
  ));

  return (
    <div className="view">
      <h1>DEFINE PARKING LOT</h1>
      <div className="button-wrapper">
        <Stack spacing={2} direction="column">
          <Button
            variant="contained"
            onClick={() => {
              inputFile.current.click();
            }}
          >
            Browse
          </Button>
          <input
            type="file"
            onChange={handleChange}
            ref={inputFile}
            style={{ display: "none" }}
          />
          {/* {file.name} */}
          {/* <strong>Uploaded Files:</strong>{" "}
            {file.map((x) => x.name).join(", ")} */}
          <Button variant="contained">Cam Capture</Button>
        </Stack>
      </div>
      <div className="layout">
        <div className="image-editor">
          {/* <Box
              className="image"
              component="img"
              sx={{
                height: 400,
                width: 600,
              }}
              alt="The house from the offer."
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
            /> */}
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
            onMouseMove={trackRect}
            onMouseUp={endRect}
          ></canvas>
          <div>
            <Stack spacing={2} direction="row">
              <Button variant="contained">Save to Landmark</Button>
              <Button variant="contained">Save to Parking Slots</Button>
              <Button variant="contained">Save Rol</Button>
            </Stack>
          </div>
        </div>

        <div className="data-list">
          <Box
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            <h2>Data storage</h2>
            <nav aria-label="secondary mailbox folders">
              <List
                sx={{
                  width: "100%",
                  height: 200,
                  overflowY: "scroll",
                }}
              >
                {dataMap}
              </List>
            </nav>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button>Undo</Button>
              <Button>Redo</Button>
              <Button>Reset</Button>
            </ButtonGroup>
            <div className="button-wrapper">
              <Stack spacing={2} direction="row">
                <Button onClick={back} variant="text">
                  Back
                </Button>
                <Button onClick={toResult} variant="text">
                  Next
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Calib;

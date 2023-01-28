import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import DebugDrawer from "../components/ultilites/DebugDrawer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import default_image from "../assets/default_image.png";

//import routing
import { useHistory, useParams } from "react-router-dom";

//import state management
import { useSelector, useDispatch } from "react-redux";
import { getParkingLotByIdRex, setActiveStep } from "../redux/parkingLots";

//import style
import "../style/Result.css";
import { styled } from "@mui/system";
import { theme } from "../style/CustomTheme";

function Result() {
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );
  const loading = useSelector((state) => state.parkingReducer.loading);
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [refImage, setRefImage] = useState();
  const [calibImage, setCalibImage] = useState();
  const [capturedImage, setCapturedImage] = useState();
  const [matchingRate, setMatchingRate] = useState();
  const [incre, setIncre] = useState(0);

  //get full result list: id - image - matching rate
  const [result, setResult] = useState([]);

  //image data
  const gridData = [
    { title: "Standard Image", src: refImage },
    { title: "Captured Image", src: capturedImage },
    { title: "Calibrated Image", src: calibImage },
  ];

  const history = useHistory();

  //get parking lot name
  //const parking_name = history.location.state;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveStep(2));
    getStandardImage();
    dispatch(getParkingLotByIdRex(id))
      .unwrap()
      .then((res) => {
        //console.log(res.result);
        setTitle(res.title);
        setResult(
          res.result.map((data) => ({
            id: data.id,
            captured: `${data.title.substring(
              0,
              data.title.indexOf("(") - 1
            )}.jpg`,
            calibrated: data.title,
            match: data.match,
          }))
        );
      })
      .then(() => {
        getCalibImage(default_image);
        getCapturedImage(default_image);
      });
  }, []);

  //get standard image
  const getStandardImage = () => {
    try {
      setRefImage(require(`../assets/Reference/${id}.jpg`));
    } catch (err) {
      setRefImage(default_image);
    }
  };

  //get captured image -> iterate through array
  const getCapturedImage = (image_name) => {
    try {
      if (title == "Test Parking Lot") {
        setCapturedImage(
          require(`../../backend/test_img_calib/Data/Mock/${image_name}`)
        );
      } else {
        setCapturedImage(
          require(`../assets/Parking Lots/Sample lot/${image_name}`)
        );
      }
      //setCalibImage(require(`../assets/Calibrated/${id}_rotated.jpg`));
    } catch (err) {
      setCapturedImage(default_image);
    }
  };

  //get calibrated image -> iterate through array
  const getCalibImage = (image_name) => {
    try {
      if (title == "Test Parking Lot") {
        setCalibImage(
          require(`../../backend/test_img_calib/Calibrated/Mock/${image_name}`)
        );
      } else {
        setCalibImage(require(`../assets/Calibrated/${title}/${image_name}`));
      }

      //setCalibImage(require(`../assets/Calibrated/${id}_rotated.jpg`));
    } catch (err) {
      setCalibImage(default_image);
    }
  };

  //show captured and calibrated image
  //called -> iterate
  const nextResult = () => {
    try {
      getCapturedImage(result[incre].captured);
      getCalibImage(result[incre].calibrated);
      setMatchingRate(result[incre].match);
      setIncre(incre + 1);
    } catch (err) {
      window.location.reload();
    }
  };

  //compare with Reference: show binary image
  const compareWithReference = (index) => {
    try {
      var image_name = result[index].calibrated;
      if (title == "Test Parking Lot") {
        setCalibImage(
          require(`../../backend/test_img_calib/Binary/Mock/${image_name}`)
        );
      } else {
        setCalibImage(require(`../assets/Binary/${title}/${image_name}`));
      }

      //setCalibImage(require(`../assets/Calibrated/${id}_rotated.jpg`));
    } catch (err) {
      setCalibImage(default_image);
    }
  };

  const test = () => {
    //console.log(title);
    //console.log(capturedImageList);
    //console.log(calibImageList);
    console.log(result[0]);
  };

  //navigate to home screen
  const toHome = () => {
    history.push("/");
  };

  const gridItem = gridData.map((data, index) => (
    <Grid key={index} columns={{ xs: 4, sm: 8, md: 12 }}>
      <Typography variant="h2" style={{ fontSize: 20 }}>
        {data.title}
      </Typography>
      <Box
        className="image"
        component="img"
        sx={{
          height: 270,
          width: 400,
        }}
        alt={data.title}
        src={data.src}
      />
    </Grid>
  ));
  return (
    <div className="layout">
      <Typography variant="h1">Result</Typography>
      {/* <Button onClick={test}>Test</Button> */}
      <div>
        <Grid
          container
          justifyContent="center"
          rowSpacing={1}
          //responsive grid
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {gridItem}
        </Grid>
      </div>
      <Typography variant="h2">Rating: {matchingRate}</Typography>
      {/* <Grid xs={12}>
        <Typography variant="h2">Rating: {matchingRate}</Typography>
      </Grid> */}
      <div className="button-wrapper">
        <Stack spacing={2} direction="row">
          <Tooltip title="Back to Define mode">
            <IconButton
              onClick={toHome}
              style={{ color: theme.palette.primary.main }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compare to reference">
            <Button
              variant="outlined"
              onClick={() => {
                compareWithReference(incre);
              }}
            >
              Compare
            </Button>
          </Tooltip>
          <Tooltip title="Observe next result">
            <Button variant="outlined" onClick={nextResult}>
              Next
            </Button>
          </Tooltip>
          <DebugDrawer />
          <Tooltip title="Accept result">
            <IconButton style={{ color: theme.palette.primary.main }}>
              <ArrowForwardIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </div>
    </div>
  );
}

export default Result;

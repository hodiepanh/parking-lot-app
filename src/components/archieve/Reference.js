import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../style/Reference.css";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import { setReferenceImage } from "../../redux/parkingLots";
import default_image from "../assets/default_image.png";

function Reference() {
  const [file, setFile] = useState();
  const inputFile = useRef(null);
  const [refImage, setRefImage] = useState(default_image);
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );
  const dispatch = useDispatch();
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
    console.log(standardImage);
  };

  const history = useHistory();

  const back = () => {
    history.push("/home");
    window.location.reload(false);
  };
  const toCalib = () => {
    //dispatch(setReferenceImage(refImage));
    history.push("/calib");
    //window.location.reload(false);
  };

  return (
    <div>
      <div>
        <h1>SELECT REFERENCE IMAGE</h1>
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
        {/* {refImage && ( */}
        <Box
          component="img"
          sx={{
            height: 300,
            width: 450,
          }}
          alt="The house from the offer."
          // src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
          src={refImage}
        />
        {/* )} */}
        <div className="button-footer">
          <Button variant="text">Reset</Button>
          <Stack spacing={2} direction="row">
            <Button onClick={back} variant="text">
              Back
            </Button>
            <Button onClick={toCalib} variant="text">
              Next
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default Reference;

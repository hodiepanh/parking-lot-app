import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";

//import style
import "../../style/ultilities.css";

function DrawMode({ mode, setMode }) {
  const handleRadioChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <div>
      <form>
        <FormControl
          sx={{
            m: 3,
            display: "flex",
            alignItems: "flex-start",
            margin: "20px 0",
          }}
          variant="standard"
        >
          <FormLabel id="demo-error-radios">Choose a drawing mode:</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-error-radios"
            name="quiz"
            value={mode}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="landmark"
              control={<Radio />}
              label="Landmark"
            />
            <FormControlLabel
              value="slot"
              control={<Radio />}
              label="Parking Slot"
            />
          </RadioGroup>
        </FormControl>
      </form>
    </div>
  );
}

export default DrawMode;

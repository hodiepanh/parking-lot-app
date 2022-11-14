import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";

function DrawMode({ mode, setMode }) {
  //   const [value, setValue] = React.useState("");

  const handleRadioChange = (event) => {
    setMode(event.target.value);
    //console.log(event.target.value);
  };

  return (
    <div>
      <form>
        <FormControl sx={{ m: 3 }} variant="standard">
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

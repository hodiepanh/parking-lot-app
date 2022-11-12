import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "../style/SettingOverlay.css";

function SettingOverlay() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <h2>Camera settings</h2>
        <Box
          className="setting-form"
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Username" variant="outlined" />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
          ></TextField>
          <TextField
            id="outlined-basic"
            label="IP Address"
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            label="Access Port"
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            label="Device Number"
            variant="outlined"
          />
        </Box>
      </div>
      <div>
        <h2>Calibration Settings</h2>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="outlined-adornment-weight"
              //   value={values.weight}
              //   onChange={handleChange("weight")}
              endAdornment={
                <InputAdornment position="end">seconds</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />{" "}
            <FormHelperText id="outlined-weight-helper-text">
              Calibration intervals
            </FormHelperText>
          </FormControl>
        </Box>
      </div>
      <div>
        <h2>Debug settings</h2>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Dump debug information"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Test calibration (Calibrate with image in storage)"
            />
          </FormGroup>
        </Box>
      </div>
    </div>
  );
}

export default SettingOverlay;

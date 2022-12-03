import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

//import style
import "../../style/SettingOverlay.css";

//import form controll
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

function SettingOverlay() {
  const [open, setOpen] = React.useState(false);

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      ip: "",
      port: 554,
      device: 1,
      interval: 10,
    },
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //setup initial data for each field
  const initialValues = [
    {
      name: "username",
      rules: { required: true },
      error: errors.username,
      label: "Username",
      message: "This is required.",
      type: "",
    },
    {
      name: "password",
      rules: { required: true },
      error: errors.password,
      label: "Password",
      message: "This is required.",
      type: "password",
    },
    {
      name: "ip",
      rules: { required: true },
      error: errors.ip,
      label: "IP Address",
      message: "This is required.",
      type: "",
    },
    {
      name: "port",
      rules: { required: true },
      error: errors.port,
      label: "Access Port",
      message: "This is required.",
      type: "number",
    },
    {
      name: "device",
      rules: { required: true },
      error: errors.device,
      label: "Device Number",
      message: "This is required.",
      type: "number",
    },
  ];

  //map initial data into controlled field
  const controlMap = initialValues.map((data, index) => (
    <div className="controller">
      <Controller
        className="form-controller"
        key={index}
        name={data.name}
        control={control}
        rules={data.rules}
        render={({ field: { nameRef, ...field } }) => (
          <div>
            <TextField
              {...field}
              id="outlined-basic"
              inputRef={nameRef}
              label={data.label}
              variant="outlined"
              error={!!data.error}
              type={data.type}
              className="field"
            />
            <ErrorMessage
              errors={errors}
              name={data.name}
              render={() => <div>{data.message}</div>}
            />
          </div>
        )}
      />
    </div>
  ));

  return (
    <div className="main">
      <div className="setting-form">
        <Typography variant="h1">Settings</Typography>
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h3">Camera setting</Typography>
            <div className="setting-wrapper">
              <div className="camera-setting">{controlMap}</div>
              <Button variant="outlined" type="submit">
                Test
              </Button>
            </div>
          </form>

          <div className="form">
            <Typography variant="h3">Function setting</Typography>
            <div className="controller">
              <Controller
                name="interval"
                control={control}
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <div>
                    <OutlinedInput
                      {...field}
                      id="outlined-adornment-weight"
                      inputRef={ref}
                      type="number"
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      className="field"
                    />{" "}
                    <FormHelperText id="outlined-weight-helper-text">
                      Calibration intervals
                    </FormHelperText>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="controller">
            <Controller
              name="debug"
              control={control}
              //rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <div>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Dump debug information"
                      className=""
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Test calibration (Calibrate with image in storage)"
                      className="field"
                    />
                  </FormGroup>
                </div>
              )}
            />
          </div>
          <Button variant="outlined">Browse</Button>
        </div>
      </div>
    </div>
  );
}

export default SettingOverlay;

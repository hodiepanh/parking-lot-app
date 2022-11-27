import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "../../style/SettingOverlay.css";
import { Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

function SettingOverlay() {
  const [open, setOpen] = React.useState(false);
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [ip, setIP] = useState("");
  const [debug, setDebug] = useState(false);
  const [test, setTest] = useState(false);
  //const ref = useRef();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: "",
      password: password,
      ip: ip,
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
  const controlMap = initialValues.map((data, index) => (
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
          />
          <ErrorMessage
            errors={errors}
            name={data.name}
            render={() => <p>{data.message}</p>}
          />
        </div>
      )}
    />
  ));

  return (
    <div className="setting-form">
      <h1>Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Camera setting</h2>
        <div className="camera-setting">{controlMap}</div>
        <Button type="submit">Test</Button>
      </form>
      <form>
        <h2>Function settings</h2>
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
              />{" "}
              <FormHelperText id="outlined-weight-helper-text">
                Calibration intervals
              </FormHelperText>
            </div>
          )}
        />
      </form>

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
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Test calibration (Calibrate with image in storage)"
              />
            </FormGroup>
          </div>
        )}
      />
      <Button>Browse</Button>
    </div>
  );
}

export default SettingOverlay;

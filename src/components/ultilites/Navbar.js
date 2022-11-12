import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import SettingOverlay from "../SettingOverlay";
import MuiAlert from "@mui/material/Alert";
import Notification from "./Notification";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Navbar() {
  const [open, setOpen] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");
  const [openNoti, setOpenNoti] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Button onClick={handleClickOpen} color="inherit">
              Setting
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                setSavedStatus("success");
                setOpenNoti(true);
              }}
            >
              Save
            </Button>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <SettingOverlay />
        <Notification
          severity={savedStatus}
          open={openNoti}
          setOpen={setOpenNoti}
        />
      </Dialog>
    </div>
  );
}

export default Navbar;

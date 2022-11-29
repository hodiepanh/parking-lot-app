import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import SettingOverlay from "./SettingOverlay";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Notification from "./Notification";
import { useDispatch } from "react-redux";
import { openNotification } from "../../redux/parkingLots";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Navbar() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

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
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Logo
            </Typography>
            <Button color="inherit" onClick={handleClickOpen}>
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
        <AppBar sx={{ position: "static" }}>
          <Toolbar>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                dispatch(
                  openNotification({
                    status: "success",
                    message: "Data saved successfully.",
                  })
                );
                handleClose();
              }}
            >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <SettingOverlay />
        <Notification />
      </Dialog>
    </div>
  );
}

export default Navbar;

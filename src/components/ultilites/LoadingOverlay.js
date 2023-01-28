import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Backdrop from "@mui/material/Backdrop";

//import style
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
const StyleBox = styled(Box)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  top: 0,
  height: "100vh",
  backgroundColor: "transparent",
  position: "fixed",
}));

function LoadingOverlay({ open, setOpen }) {
  // const handleClose = () => {
  //   setOpen(false);
  // };
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        // onClick={handleClose}
      >
        <Stack justifyContent="center" alignItems="center" spacing={2}>
          <CircularProgress color="inherit" />
          <Typography variant="body1">Please wait ... </Typography>
        </Stack>
      </Backdrop>
    </div>
  );
}

export default LoadingOverlay;

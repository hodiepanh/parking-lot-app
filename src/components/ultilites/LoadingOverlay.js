import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";

//import style
import { styled } from "@mui/system";
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

function LoadingOverlay() {
  return (
    <div>
      <Dialog open={true}>
        <StyleBox>
          <CircularProgress />
          <div>Please wait... </div>
        </StyleBox>
      </Dialog>
    </div>
  );
}

export default LoadingOverlay;

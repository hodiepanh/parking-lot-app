import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";

import { display } from "@mui/system";

//import style
// import { styled } from "@mui/system";
// const StyleList = styled(List)(({ theme }) => ({
//   width: "100%",
//   "& .MuiIconButton-root": {
//     color: "white",
//   },
// }));

function LoadingOverlay(open) {
  return (
    <div>
      <Dialog open={open}>
        <Stack
          gap={1}
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "transparent" }}
        >
          <CircularProgress />
          <div>Please wait... </div>
        </Stack>
      </Dialog>
    </div>
  );
}

export default LoadingOverlay;

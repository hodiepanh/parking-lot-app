import React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

//import state management
import { useDispatch, useSelector } from "react-redux";
import { closeNotification } from "../../redux/parkingLots";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Notification() {
  const noti = useSelector((state) => state.parkingReducer.notification);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeNotification());
  };
  return (
    <div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={noti.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={noti.status}
            sx={{ width: "100%" }}
          >
            {noti.message}
          </Alert>
        </Snackbar>
        {/* <Alert severity="error">This is an error message!</Alert>
        <Alert severity="warning">This is a warning message!</Alert>
        <Alert severity="info">This is an information message!</Alert>
        <Alert severity="success">This is a success message!</Alert> */}
      </Stack>
    </div>
  );
}

export default Notification;

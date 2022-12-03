import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

//import state management
import { useDispatch, useSelector } from "react-redux";
import { closeAlert } from "../../redux/parkingLots";
import { deleteParkingLotRex } from "../../redux/parkingLots";

//import style
import { styled } from "@mui/system";
import "../../style/ultilities.css";

const StyleDialog = styled(Dialog)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  "& .MuiDialogTitle-root": {
    fontWeight: 500,
    fontSize: "16px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#878787",
  },
  "& .MuiDialogContentText-root": {
    fontWeight: 400,
    fontSize: "14px",
    color: "#878787",
  },
}));

function AlertDialog({ lotsList, setLotsList }) {
  const alert = useSelector((state) => state.parkingReducer.alert);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeAlert());
  };

  //remove parking lot from list
  const removeLot = (index) => {
    //find parking lot with index !== chosen index ->update state
    const newList = lotsList.filter((item) => item.id !== index);
    setLotsList(newList);

    //remove from database
    dispatch(deleteParkingLotRex(index));
  };
  return (
    <div>
      <StyleDialog
        open={alert.open}
        onClose={handleClose}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Parking lot will be permanently deleted"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you wish to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className="dialog-button"
            // onClick={handleAnswer}
            onClick={() => {
              removeLot(alert.data.id);
              handleClose();
            }}
            autoFocus
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            className="dialog-button"
            onClick={handleClose}
          >
            No
          </Button>
        </DialogActions>
      </StyleDialog>
    </div>
  );
}

export default AlertDialog;

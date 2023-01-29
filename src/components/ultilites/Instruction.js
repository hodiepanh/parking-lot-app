import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Instruction({ stage, open, handleClose }) {
  //const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  // const handleClickOpen = () => {
  //   setOpen(true);
  //   setScroll("paper");
  // };

  // const handleClose = () => {
  //   //setOpen(false);
  // };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  //title and description of instructions
  const instructions = [
    {
      title: "Choose parking lot",
      description:
        "Welcome to Image Calibration.\n Pick a parking lot to calibrate from the list of available praking lot.\nCan't find what you're looking for? Define a new parking lot. Remember to avoid blank title and already-chosen title.",
    },
    {
      title: "Define parking lot",
      description:
        "This is where users define the chosen parking lot. If you see an image of the parking lot, that means this site is already defined and you can carry on and run the program by clicking the NEXT button. If not, replace the default image with an image of your choosing. Once that is done, choose a drawing mode to define the parking lot. In the LANDMARK mode, click on the yellow rectangles on the images to define the LANDMARK coordinates. Remember to follow the number order. In the PARKING SLOT and ROI mode, click and drag for a bigger rectangle. Remember to save your data before moving to the next step, the application will notify you if there is missing data.",
    },
    {
      title: "Observe result",
      description:
        "Once done running Image Calibration, you can observe the result. Click NEXT to observe next result. To check the binary image, click the COMPARE button.",
    },
  ];

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {instructions[stage].title}
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {instructions[stage].description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Thanks, Got It</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Instruction;

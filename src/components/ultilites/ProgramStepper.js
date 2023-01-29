import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepButton from "@mui/material/StepButton";
import { Tooltip } from "@mui/material";

//import state management
import { useSelector, useDispatch } from "react-redux";

//import component
import Instruction from "./Instruction";

// define step label
const steps = [
  "Choose parking lot",
  "Define parking lot",
  "Observe calibrated result",
];

function ProgramStepper() {
  const step = useSelector((state) => state.parkingReducer.activeStep);
  const [completed, setCompleted] = useState({});
  const [openInstruct, setOpenInstruct] = useState(false);
  const [chosenStage, setChosenStage] = useState(0);

  const openInstruction = (stage) => {
    setOpenInstruct(true);
    setChosenStage(stage);
  };

  const closeInstruction = () => {
    setOpenInstruct(false);
  };

  return (
    <div>
      <Box className="stepper">
        <Stepper nonLinear activeStep={step}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <Tooltip title="Click here for instruction">
                <StepButton
                  color="inherit"
                  onClick={() => {
                    openInstruction(index);
                  }}
                >
                  {label}
                </StepButton>
              </Tooltip>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box className="stepper-active">
        <Stepper>
          <Step>
            <Tooltip title="Click here for instruction">
              <StepButton
                color="inherit"
                icon={step + 1}
                onClick={() => {
                  openInstruction(step);
                }}
              >
                {steps[step]}
              </StepButton>
            </Tooltip>
          </Step>
        </Stepper>
      </Box>
      <Instruction
        stage={chosenStage}
        open={openInstruct}
        handleClose={closeInstruction}
      />
    </div>
  );
}

export default ProgramStepper;

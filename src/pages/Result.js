import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import "../style/Result.css";
import DebugDrawer from "../components/ultilites/DebugDrawer";
import { useHistory } from "react-router-dom";
//import style
import { styled } from "@mui/system";
const RedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

function Result() {
  const standardImage = useSelector(
    (state) => state.parkingReducer.standardImage
  );

  const gridData = [
    { title: "Standard Image", src: standardImage },
    { title: "Captured Image", src: standardImage },
    { title: "Calibrated Image", src: standardImage },
  ];

  const history = useHistory();
  const toHome = () => {
    history.push("/");
  };

  const gridItem = gridData.map((data, index) => (
    <Grid key={index} xs={4}>
      <Typography variant="h2" style={{ fontSize: 20 }}>
        {data.title}
      </Typography>
      <Box
        className="image"
        component="img"
        sx={{
          height: 270,
          width: 400,
        }}
        alt="The house from the offer."
        src={data.src}
      />
    </Grid>
  ));
  return (
    <div>
      <Typography variant="h1">Result</Typography>
      <div className="layout">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {gridItem}
          <Grid xs={12}>
            <Typography variant="h2">Rating</Typography>
            <DebugDrawer />
          </Grid>
        </Grid>
      </div>
      <div className="button-wrapper">
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={toHome}>
            Back to Define mode
          </Button>
          <RedButton variant="contained">Compare to Reference</RedButton>
          <Button variant="contained">Accept results</Button>
        </Stack>
      </div>
    </div>
  );
}

export default Result;

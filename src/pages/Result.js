import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import "../style/Result.css";
import DebugDrawer from "../components/ultilites/DebugDrawer";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
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

  const gridItem = gridData.map((data) => (
    <Grid xs={4}>
      <h3>{data.title}</h3>
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
      <h1>Results</h1>
      <div className="layout">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {gridItem}
          <Grid xs={12}>
            <h2>Rating</h2>
            <DebugDrawer />
          </Grid>
        </Grid>
      </div>
      <div className="button-wrapper">
        <Stack spacing={2} direction="row">
          <Button variant="contained">Back to Define mode</Button>
          <Button variant="contained">Compare to Reference</Button>
          <Button variant="contained">Accept results</Button>
        </Stack>
      </div>
    </div>
  );
}

export default Result;

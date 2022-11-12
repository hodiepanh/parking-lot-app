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
  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
      heading: "Standard Image",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
      heading: "Captured Image",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
      heading: "Calibrated Image",
    },
  ];
  return (
    <div>
      <h1>Results</h1>
      <div className="layout">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid xs={4}>
            <h2>Standard Image</h2>
            <Box
              className="image"
              component="img"
              sx={{
                height: 200,
                width: 300,
              }}
              alt="The house from the offer."
              src={standardImage}
            />
          </Grid>
          <Grid xs={4}>
            <h2>Captured Image</h2>
            <Box
              className="image"
              component="img"
              sx={{
                height: 200,
                width: 300,
              }}
              alt="The house from the offer."
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
            />
          </Grid>
          <Grid xs={4}>
            <h2>Calibrated Image</h2>
            <Box
              className="image"
              component="img"
              sx={{
                height: 200,
                width: 300,
              }}
              alt="The house from the offer."
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
            />
          </Grid>
          <Grid xs={4}>
            <h1>RATING</h1>
          </Grid>
        </Grid>
        <Box
          className="debug-list"
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          <h2>Data storage</h2>
          <nav aria-label="secondary mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Trash" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="#simple-list">
                  <ListItemText primary="Spam" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>
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

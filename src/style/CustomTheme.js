import { createTheme, experimental_sx as sx } from "@mui/material";
import CssBaseline from "@mui/material";
import { red } from "@mui/material/colors";
//const font = "'Hanalei Fill', cursive";
export const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    h1: {
      fontSize: 32,
      fontWeight: 700,
      lineHeight: "50px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    h2: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: "30px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    h3: {
      fontSize: 24,
      fontWeight: 400,
      lineHeight: "30px",
      letterSpacing: "0.05em",
      textTransform: "capitalize",
    },
    h4: {
      fontStyle: "italic",
      fontSize: 20,
      fontWeight: 200,
      lineHeight: "24px",
      letterSpacing: "0.05em",
      textTransform: "capitalize",
    },
    body1: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: "30px",
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: "25px",
    },
    button: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "39px",
    },
  },
  palette: {
    primary: {
      main: "#088E90",
      light: "#46BEBE",
    },
    // background: {
    //   default: "#DDDDDD",
    // },
    error: {
      main: "#CC5050",
      light: "#FF6E6E",
    },
    warning: {
      main: "#C9A545",
      light: "#E5BC4E",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        outlined: {
          border: "2px solid",
          ":hover": {
            border: "2px solid",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: sx({
          "&MuiOutlinedInput-root": {
            "&>fieldset": {
              borderColor: "red",
            },
          },
        }),
        input: {
          borderColor: "red",
          color: "red",
        },
      },
    },
  },
});

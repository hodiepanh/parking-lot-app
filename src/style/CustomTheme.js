import { createTheme, experimental_sx as sx } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    h1: {
      fontSize: 32,
      fontWeight: 700,
      lineHeight: "80px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      "@media (max-width:800px)": {
        fontSize: "1.5rem",
      },
    },
    h2: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: "50px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      "@media (max-width:800px)": {
        fontSize: "1.2rem",
      },
    },
    h3: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: "50px",
      letterSpacing: "0.05em",
      textTransform: "capitalize",
      "@media (max-width:800px)": {
        fontSize: "1rem",
        letterSpacing: "0.05em",
      },
    },
    h4: {
      fontStyle: "italic",
      fontSize: 14,
      fontWeight: 400,
      lineHeight: "24px",
      letterSpacing: "0.05em",
      textTransform: "capitalize",
      "@media (max-width:800px)": {
        fontSize: "1.1rem",
      },
    },
    body1: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "30px",
      "@media (max-width:800px)": {
        fontSize: "0.9rem",
      },
    },
    body2: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: "25px",
      // "@media (max-width:800px)": {
      //   fontSize: "1.5rem",
      // },
    },
    button: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "30px",
      "@media (max-width:800px)": {
        fontSize: "0.85rem",
      },
    },
  },
  palette: {
    primary: {
      main: "#088E90",
      light: "#46BEBE",
    },
    success: {
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
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      disableElevation: true,
      styleOverrides: {
        root: {
          borderRadius: 0,
          disableElevation: true,
        },
        contained: {
          disableElevation: true,
        },
        outlined: {
          border: "2px solid",
          ":hover": {
            border: "2px solid",
          },
        },
      },
    },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: sx({
    //       "&MuiOutlinedInput-root": {
    //         "&>fieldset": {
    //           borderColor: "red",
    //         },
    //       },
    //     }),
    //     input: {
    //       borderColor: "red",
    //       color: "red",
    //     },
    //   },
    // },
    //list
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#878787",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    // MuiDialog: {
    //   styleOverrides: {
    //     root: {
    //       paper: {
    //         backgroundColor: "red",
    //       },
    //       borderRadius: 0,
    //     },
    //   },
    // },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#DDDDDD",
        },
      },
    },
  },
});

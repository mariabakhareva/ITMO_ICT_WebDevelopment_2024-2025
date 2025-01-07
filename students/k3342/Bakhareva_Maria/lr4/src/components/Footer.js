import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        textAlign: "center",
        padding: "10px",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body1">Лечебная клиника © {new Date().getFullYear()}</Typography>
    </Box>
  );
};

export default Footer;

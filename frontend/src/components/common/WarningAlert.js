import React from "react";
import { Box, Alert, AlertTitle, Typography } from "@mui/material";

const WarningAlert = ({
  title,
  message,
  severity = "warning",
  maxWidth = 500,
  marginTop = 0,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: marginTop,
      }}
    >
      <Alert
        severity={severity}
        variant="outlined"
        sx={{
          maxWidth: maxWidth,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: (theme) => theme.shadows[4],
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          border: "1px solid",
          borderColor: `${severity}.light`,
          "& .MuiAlert-icon": {
            fontSize: "3.5rem",
            mr: 0,
            mb: 2,
            color: `${severity}.main`,
          },
          "& .MuiAlert-message": {
            width: "100%",
            p: 0,
          },
        }}
      >
        <AlertTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            mb: 1.5,
            color: `${severity}.main`,
          }}
        >
          {title}
        </AlertTitle>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.6 }}
        >
          {message}
        </Typography>
      </Alert>
    </Box>
  );
};

export default WarningAlert;

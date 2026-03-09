import React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

const ConfirmationNotification = ({
  open,
  onClose,
  title,
  message,
  severity = "success",
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
      >
        {title && <AlertTitle sx={{ fontWeight: "bold" }}>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ConfirmationNotification;

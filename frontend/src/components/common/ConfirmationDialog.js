import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ConfirmationDialog = ({
  title,
  description,
  open,
  onClose,
  buttonOneText,
  buttonTwoText,
  buttonOneHandle,
  buttonTwoHandle,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: "bold", textAlign: { xs: "center", sm: "left" } }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <DialogContentText
          sx={{ textAlign: { xs: "center", sm: "left" }, borderRadius: 2 }}
        >
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, pb: 3, justifyContent: { xs: "center", sm: "flex-end" } }}
      >
        <Button
          onClick={buttonOneHandle}
          color="inherit"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {buttonOneText}
        </Button>
        <Button
          onClick={buttonTwoHandle}
          variant="contained"
          color="error"
          autoFocus
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          {buttonTwoText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

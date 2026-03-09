import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLanguage } from "../../i18n/LanguageContext";

const ProjectModal = ({
  open,
  onClose,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  onSubmit,
  isEditing,
  errors,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { translate } = useLanguage();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {isEditing
          ? translate("edit_project")
          : translate("create_new_project")}
      </DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          label={translate("project_name_label")}
          type="text"
          fullWidth
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          error={errors.name !== ""}
          helperText={errors.name}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <TextField
          margin="dense"
          label={translate("project_description_label")}
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {translate("cancel_button")}
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          {isEditing
            ? translate("save_changes_button")
            : translate("create_project_button")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectModal;

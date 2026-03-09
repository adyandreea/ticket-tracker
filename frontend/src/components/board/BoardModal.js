import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLanguage } from "../../i18n/LanguageContext";

const BoardModal = ({
  open,
  onClose,
  boardName,
  setBoardName,
  boardDescription,
  setBoardDescription,
  selectedProjectId,
  setSelectedProjectId,
  projectsData,
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
        {isEditing ? translate("edit_board") : translate("create_new_board")}
      </DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          label={translate("board_name_label")}
          type="text"
          fullWidth
          variant="outlined"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          error={errors.name !== ""}
          helperText={errors.name}
          sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <TextField
          margin="dense"
          label={translate("board_description_label")}
          type="text"
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          value={boardDescription}
          onChange={(e) => setBoardDescription(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="project-select-label">
            {translate("board_project_label")}
          </InputLabel>
          <Select
            labelId="project-select-label"
            value={selectedProjectId}
            label={translate("board_project_label")}
            error={errors.projectId !== ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {projectsData.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            : translate("create_board_button")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BoardModal;

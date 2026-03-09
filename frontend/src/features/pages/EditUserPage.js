import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import {
  Box,
  Container,
  Table,
  Typography,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getAllUsers, deleteUser, updateUser } from "../../api/editUserApi";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import ProfileSidebar from "../../components/layout/ProfileSidebar";
import { useLanguage } from "../../i18n/LanguageContext";
import ConfirmationNotification from "../../components/common/ConfirmationNotification";

const EditUserPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [errors, setErrors] = useState({});

  const handleSidebarToggle = () => setSidebarOpen(!isSidebarOpen);
  const handleProfileClick = () => setProfileSidebarOpen(!isProfileSidebarOpen);
  const { translate } = useLanguage();
  const [serverMessage, setServerMessage] = useState({
    type: "success",
    text: "",
  });
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (user) => {
    setSelectedUser({ ...user });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUser(null);
    setErrors({});
  };

  const validate = () => {
    let tempErrors = {};

    if (!selectedUser?.firstname?.trim()) {
      tempErrors.firstname = translate("firstname_required");
    }

    if (!selectedUser?.lastname?.trim()) {
      tempErrors.lastname = translate("lastname_required");
    }

    if (!selectedUser?.username?.trim()) {
      tempErrors.username = translate("username_required");
    } else if (selectedUser.username.trim().length < 3) {
      tempErrors.username = translate("username_length_invalid");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!selectedUser?.email?.trim()) {
      tempErrors.email = translate("email_required");
    } else if (!emailRegex.test(selectedUser.email)) {
      tempErrors.email = translate("email_invalid");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validate()) return;

    try {
      const updated = await updateUser(selectedUser.id, selectedUser);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));

      setServerMessage({
        type: "success",
        text: `${translate("user")} ${updated.username || selectedUser.username} ${translate("user_updated_successfully")}`,
      });

      setNotificationOpen(true);
      handleCloseEdit();
    } catch (err) {
      setServerMessage({ type: "error", text: translate("update_user_error") });
      setNotificationOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setUsers(users.filter((user) => user.id !== userToDelete.id));

      setServerMessage({
        type: "success",
        text: `${translate("user")} ${userToDelete.username} ${translate("user_deleted_successfully")}`,
      });

      setNotificationOpen(true);
      setShowConfirmationDialog(false);
    } catch (err) {
      setServerMessage({ type: "error", text: translate("delete_user_error") });
      setNotificationOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <ProfileSidebar
        open={isProfileSidebarOpen}
        onClose={() => setProfileSidebarOpen(false)}
      />

      <Navbar
        onMenuClick={handleSidebarToggle}
        onProfileClick={handleProfileClick}
      />

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, sm: 4 },
          mb: 4,
          px: { xs: 2, sm: 3 },
          flexGrow: 1,
          pt: { xs: "64px", sm: "70px" },
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
              color: "text.primary",
            }}
          >
            {translate("user_administration_title")}
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "24px",
            boxShadow: "0 12px 50px rgba(0,0,0,0.1)",
            overflowX: "auto",
            width: "100%",
            maxHeight: "70vh",
            transition: "all 0.3s ease",
            "&:hover": { boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "divider",
              borderRadius: "10px",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "text.disabled",
              },
            },
          }}
        >
          {loading ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                    {translate("firstname_label")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                    {translate("lastname_label")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                    {translate("username_label")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                    {translate("email_label")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                    {translate("user_role_label")}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: "text.primary" }}
                    align="center"
                  >
                    {translate("edit_title_user")}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: "text.primary" }}
                    align="center"
                  >
                    {translate("delete_title_user")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenEdit(user)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setUserToDelete(user);
                          setShowConfirmationDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: { xs: "0", sm: "20px" },
            m: { xs: 0, sm: 2 },
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {translate("edit_user")}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedUser && (
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 1,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            >
              <TextField
                label={translate("firstname_label")}
                value={selectedUser.firstname}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    firstname: e.target.value,
                  });
                  if (errors.firstname) setErrors({ ...errors, firstname: "" });
                }}
                error={!!errors.firstname}
                helperText={errors.firstname}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label={translate("lastname_label")}
                value={selectedUser.lastname}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    lastname: e.target.value,
                  });
                  if (errors.lastname) setErrors({ ...errors, lastname: "" });
                }}
                error={!!errors.lastname}
                helperText={errors.lastname}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label={translate("username_label")}
                value={selectedUser.username}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    username: e.target.value,
                  });
                  if (errors.username) setErrors({ ...errors, username: "" });
                }}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label={translate("email_label")}
                value={selectedUser.email}
                onChange={(e) => {
                  setSelectedUser({ ...selectedUser, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <FormControl fullWidth>
                <InputLabel>{translate("user_role_label")}</InputLabel>
                <Select
                  value={selectedUser.role}
                  label={translate("user_role_label")}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="USER">USER</MenuItem>
                  <MenuItem value="MANAGER">MANAGER</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseEdit}
            color="inherit"
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {translate("cancel_button")}
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            {translate("save_changes_button")}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        title={translate("confirm_user_deletion_title")}
        description={`${translate("confirm_user_deletion_message")} ${userToDelete?.username}?`}
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
        buttonOneText={translate("cancel_button")}
        buttonTwoText={translate("delete_user_button")}
        buttonOneHandle={() => setShowConfirmationDialog(false)}
        buttonTwoHandle={handleConfirmDelete}
      />

      <ConfirmationNotification
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        severity={serverMessage.type}
        message={serverMessage.text}
      />
    </Box>
  );
};

export default EditUserPage;

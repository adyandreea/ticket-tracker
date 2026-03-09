import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import ProfileSidebar from "../../components/layout/ProfileSidebar";
import {
  getMyProfile,
  updateProfilePicture,
  deleteProfilePicture,
} from "../../api/editUserApi";
import { useLanguage } from "../../i18n/LanguageContext";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useRef } from "react";
import ConfirmationNotification from "../../components/common/ConfirmationNotification";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Divider,
  Stack,
  IconButton,
  Paper,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  VerifiedUser as RoleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ProfilePage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const handleSidebarToggle = () => setSidebarOpen(!isSidebarOpen);
  const handleProfileClick = () => setProfileSidebarOpen(!isProfileSidebarOpen);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { translate } = useLanguage();
  const fileInputRef = useRef(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [serverMessage, setServerMessage] = useState({
    type: "success",
    text: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        try {
          await updateProfilePicture(base64String);
          setUserData({ ...userData, profilePicture: base64String });
          setServerMessage({
            type: "success",
            text: translate("profile_picture_updated_successfully"),
          });
          setNotificationOpen(true);
        } catch (err) {
          setServerMessage({
            type: "error",
            text: translate("error_updating_picture"),
          });
          setNotificationOpen(true);
        }
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteProfilePicture();
      setUserData({ ...userData, profilePicture: null });
      setServerMessage({
        type: "success",
        text: translate("profile_picture_deleted_successfully"),
      });
    } catch (err) {
      setServerMessage({
        type: "error",
        text: translate("error_deleting_picture"),
      });
    } finally {
      setNotificationOpen(true);
    }
  };

  if (loading) return <LoadingScreen />;

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

      <Container maxWidth="sm" sx={{ mt: 12, mb: 4 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: (theme) => theme.shadows[3],
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
            <Avatar
              src={userData?.profilePicture}
              sx={{
                width: 120,
                height: 120,
                fontSize: "3rem",
                bgcolor: "primary.main",
                mx: "auto",
                color: "primary.contrastText",
              }}
            >
              {!userData?.profilePicture &&
                `${userData?.firstname?.[0]}${userData?.lastname?.[0]}`}
            </Avatar>
            <IconButton
              color="primary"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>

            {userData?.profilePicture && (
              <IconButton
                color="error"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  bgcolor: "background.paper",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => setShowConfirmationDialog(true)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Typography variant="h5" fontWeight="700" color="text.primary">
            {userData?.firstname} {userData?.lastname}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            @{userData?.username}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2.5}>
            <InfoRow
              icon={<EmailIcon color="action" />}
              label={translate("email_label")}
              value={userData?.email}
            />
            <InfoRow
              icon={<PersonIcon color="action" />}
              label={translate("firstname_label")}
              value={userData?.firstname}
            />
            <InfoRow
              icon={<PersonIcon color="action" />}
              label={translate("lastname_label")}
              value={userData?.lastname}
            />
            <InfoRow
              icon={<RoleIcon color="secondary" />}
              label={translate("user_role_label")}
              value={userData?.role}
              bold
            />
          </Stack>
        </Paper>
      </Container>

      {showConfirmationDialog && (
        <ConfirmationDialog
          title={translate("confirm_deletion_title")}
          description={translate("confirm_profile_picture_deletion_message")}
          open={showConfirmationDialog}
          onClose={() => setShowConfirmationDialog(false)}
          buttonOneText={translate("cancel_button")}
          buttonTwoText={translate("delete_button")}
          buttonOneHandle={() => setShowConfirmationDialog(false)}
          buttonTwoHandle={() => {
            handleDeleteImage();
            setShowConfirmationDialog(false);
          }}
        />
      )}

      <ConfirmationNotification
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        severity={serverMessage.type}
        message={serverMessage.text}
      />
    </Box>
  );
};

const InfoRow = ({ icon, label, value, bold }) => (
  <Box sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={bold ? 700 : 400}
        color="text.primary"
      >
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

export default ProfilePage;

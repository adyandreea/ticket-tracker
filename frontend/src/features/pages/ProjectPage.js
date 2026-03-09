import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import ProjectModal from "../../components/project/ProjectModal";
import ProjectCard from "../../components/project/ProjectCard";
import ProfileSidebar from "../../components/layout/ProfileSidebar";
import {
  getProjects,
  createProject,
  updateProject,
} from "../../api/projectApi";
import { useLanguage } from "../../i18n/LanguageContext";
import HasRole from "../../features/auth/HasRole";
import ConfirmationNotification from "../../components/common/ConfirmationNotification";
import WarningAlert from "../../components/common/WarningAlert";
import LoadingScreen from "../../components/common/LoadingScreen";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const [errors, setErrors] = useState({ name: "" });
  const { translate } = useLanguage();
  const [serverMessage, setServerMessage] = useState({
    type: "success",
    text: "",
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Fetch projects error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleProfileClick = () => {
    setProfileSidebarOpen(!isProfileSidebarOpen);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setIsEditing(false);
      setEditingProject(null);
      setNewProjectName("");
      setNewProjectDescription("");
      setErrors({ name: "" });
    }, 300);
  };

  const handleCreate = async () => {
    if (newProjectName.trim() === "") return;

    const newProjectRequest = {
      name: newProjectName,
      description: newProjectDescription || "",
    };

    try {
      const createdProject = await createProject(newProjectRequest);
      const completeProject = {
        ...createdProject,
        ...newProjectRequest,
        id: createdProject.id,
      };
      setProjects([...projects, completeProject]);
      handleCloseModal();
      setServerMessage({
        type: "success",
        text: translate("project_created_successfully"),
      });
      setNotificationOpen(true);
    } catch (error) {
      setServerMessage({
        type: "error",
        text: translate("create_project_error"),
      });
      setNotificationOpen(true);
    }
  };

  const handleEditStart = (project) => {
    setEditingProject(project);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description || "");
    setIsEditing(true);
    setModalOpen(true);
    setErrors({ name: "" });
  };

  const handleEditSave = async () => {
    const updateRequest = {
      name: newProjectName,
      description: newProjectDescription,
    };

    try {
      const updatedProject = await updateProject(
        editingProject.id,
        updateRequest,
      );

      setProjects(
        projects.map((p) => (p.id === editingProject.id ? updatedProject : p)),
      );
      handleCloseModal();
      setServerMessage({
        type: "success",
        text: translate("project_updated_successfully"),
      });
      setNotificationOpen(true);
    } catch (error) {
      setServerMessage({
        type: "error",
        text: translate("update_project_error"),
      });
      setNotificationOpen(true);
    }
  };

  const handleSubmit = () => {
    if (newProjectName.trim() === "") {
      setErrors({ name: translate("project_name_required") });
      return;
    }

    setErrors({ name: "" });

    if (isEditing) {
      handleEditSave();
    } else {
      handleCreate();
    }
  };

  const triggerNotification = (type, text) => {
    setServerMessage({ type, text });
    setNotificationOpen(true);
  };

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <ProfileSidebar
        open={isProfileSidebarOpen}
        onClose={() => setProfileSidebarOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: "calc(100% - 240px)" },
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Navbar
          onMenuClick={handleSidebarToggle}
          onProfileClick={handleProfileClick}
        />

        <Box
          sx={{
            p: { xs: 2, sm: 4 },
            width: "100%",
            boxSizing: "border-box",
            pt: { xs: "64px", sm: "70px" },
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 4,
              width: "100%",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#text.primary",
                fontSize: { xs: "1.8rem", sm: "2.4rem" },
                letterSpacing: "-0.5px",
              }}
            >
              {translate("project_title")}
            </Typography>
            <HasRole allowedRoles={["ADMIN"]}>
              <Button
                variant="contained"
                fullWidth={{ xs: true, sm: false }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setModalOpen(true);
                  setIsEditing(false);
                  setNewProjectName("");
                }}
              >
                {translate("create_project_button")}
              </Button>
            </HasRole>
          </Box>
          <Box
            sx={{
              display: projects.length > 0 ? "grid" : "block",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(280px, 1fr))",
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  projects={projects}
                  setProjects={setProjects}
                  handleEditStart={handleEditStart}
                  onNotify={triggerNotification}
                />
              ))
            ) : (
              <WarningAlert
                title={translate("no_projects_found_title")}
                message={translate("no_projects_found_message")}
                marginTop={5}
              />
            )}
          </Box>
          <ConfirmationNotification
            open={notificationOpen}
            onClose={() => setNotificationOpen(false)}
            severity={serverMessage.type}
            message={serverMessage.text}
          />
        </Box>
      </Box>
      <ProjectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        projectName={newProjectName}
        setProjectName={setNewProjectName}
        projectDescription={newProjectDescription}
        setProjectDescription={setNewProjectDescription}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        errors={errors}
      />
    </Box>
  );
};

export default ProjectsPage;

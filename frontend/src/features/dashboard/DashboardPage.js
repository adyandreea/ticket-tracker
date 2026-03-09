import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import DashboardBoard from "./DashboardBoard";
import Button from "@mui/material/Button";
import { getProjects } from "../../api/projectApi";
import { getBoardsByProjectId } from "../../api/boardApi";
import ProfileSidebar from "../../components/layout/ProfileSidebar";
import { useLanguage } from "../../i18n/LanguageContext";
import WarningAlert from "../../components/common/WarningAlert";
import LoadingScreen from "../../components/common/LoadingScreen";

const DashboardPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [errorProject, setErrorProject] = useState(null);

  const [boards, setBoards] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorBoard, setErrorBoard] = useState(null);
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleProfileClick = () => {
    setProfileSidebarOpen(!isProfileSidebarOpen);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data && data.length > 0) {
          setSelectedProjectId(data[0].id);
        } else {
          setLoading(false);
          setIsInitialLoad(false);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
        setErrorProject(translate("project_not_found"));
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchProjects();
  }, [translate]);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!selectedProjectId) {
        setLoading(false);
        setIsInitialLoad(false);
        return;
      }
      try {
        const data = await getBoardsByProjectId(selectedProjectId);
        setBoards(data);
        if (data && data.length > 0) {
          setSelectedBoardId(data[0].id);
        } else {
          setSelectedBoardId("");
        }
      } catch (err) {
        console.error("Error loading boards:", err);
        setErrorBoard(translate("board_not_found"));
        setBoards([]);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchBoards();
  }, [selectedProjectId, translate]);

  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
  };

  const handleBoardChange = (event) => {
    setSelectedBoardId(event.target.value);
    handleCloseModal();
  };

  if (loading && isInitialLoad) return <LoadingScreen />;

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
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Navbar
          onMenuClick={handleSidebarToggle}
          onProfileClick={handleProfileClick}
        />

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            mt: { xs: "64px", sm: "70px" },
            overflow: "hidden",
          }}
        >
          <Box sx={{ mb: 2, flexShrink: 0 }}>
            {!errorProject && projects.length > 0 && (
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 250 },
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Select
                  value={selectedProjectId}
                  onChange={handleProjectChange}
                  sx={{ fontWeight: "bold" }}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              minHeight: 0,
              display: "flex",
              borderRadius: 3,
              justifyContent: "center",
              alignItems: boards?.length > 0 ? "stretch" : "flex-start",
              p: 1,
              pt: boards?.length > 0 ? 1 : 10,
            }}
          >
            {boards && boards.length > 0 ? (
              <DashboardBoard selectedBoardId={selectedBoardId} />
            ) : boards && boards.length === 0 ? (
              <WarningAlert
                title={translate("no_boards_found_title_dashboard")}
                message={translate("no_boards_found_message_dashboard")}
                marginTop={0}
              />
            ) : null}
          </Box>

          {!errorBoard && boards && boards.length > 0 && (
            <Box
              sx={{
                mt: 2,
                py: 0,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setModalOpen(true)}
                sx={{
                  px: 3,
                  borderRadius: "10px",
                  fontWeight: 600,
                  textTransform: "none",
                  color: "primary.main",
                  borderColor: "primary.main",
                  bgcolor: "background.paper",

                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  },
                }}
              >
                {translate("switch_board_dashboard")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {translate("select_board_dashboard")}
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <Select
              value={selectedBoardId}
              onChange={handleBoardChange}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              {boards?.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;

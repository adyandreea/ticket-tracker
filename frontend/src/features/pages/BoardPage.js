import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getBoards, createBoard, updateBoard } from "../../api/boardApi";
import { getProjects } from "../../api/projectApi";
import BoardModal from "../../components/board/BoardModal";
import BoardCard from "../../components/board/BoardCard";
import ProfileSidebar from "../../components/layout/ProfileSidebar";
import { useLanguage } from "../../i18n/LanguageContext";
import HasRole from "../auth/HasRole";
import ConfirmationNotification from "../../components/common/ConfirmationNotification";
import WarningAlert from "../../components/common/WarningAlert";
import LoadingScreen from "../../components/common/LoadingScreen";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [projectsData, setProjectsData] = useState([]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const { translate } = useLanguage();
  const [serverMessage, setServerMessage] = useState({
    type: "success",
    text: "",
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ name: "", projectId: "" });

  const fetchBoardsAndProjects = async () => {
    try {
      const projects = await getProjects();
      setProjectsData(projects);

      const projectsMap = projects.reduce((map, project) => {
        map[project.id] = project.name;
        return map;
      }, {});

      const boardsData = await getBoards();

      const mappedBoards = boardsData.map((board) => ({
        ...board,
        project: projectsMap[board.projectId],
      }));

      setBoards(mappedBoards);
    } catch (error) {
      console.error("Fetch data error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardsAndProjects();
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
      setEditingBoard(null);
      setBoardName("");
      setBoardDescription("");
      setSelectedProjectId("");
      setErrors({ name: "", projectId: "" });
    }, 300);
  };

  const handleEditStart = (board) => {
    setEditingBoard(board);
    setBoardName(board.name);
    setBoardDescription(board.description || "");
    setSelectedProjectId(board.projectId);
    setIsEditing(true);
    setModalOpen(true);
    setErrors({ name: "", projectId: "" });
  };

  const handleSubmit = async () => {
    const validation = { name: "", projectId: "" };

    if (boardName.trim() === "") {
      validation.name = translate("board_name_required");
    }

    if (!selectedProjectId) {
      validation.projectId = translate("project_selection_required");
    }

    setErrors(validation);
    const hasErrors = validation.name || validation.projectId;
    if (hasErrors) return;

    const requestData = {
      name: boardName,
      description: boardDescription,
      projectId: selectedProjectId,
    };

    try {
      let resultBoard;

      if (isEditing) {
        resultBoard = await updateBoard(editingBoard.id, requestData);

        setServerMessage({
          type: "success",
          text: translate("board_updated_successfully"),
        });
        setNotificationOpen(true);
      } else {
        resultBoard = await createBoard(requestData);

        setServerMessage({
          type: "success",
          text: translate("board_created_successfully"),
        });
        setNotificationOpen(true);
      }

      const projectName = projectsData.find(
        (p) => p.id === resultBoard.projectId,
      )?.name;
      const finalBoard = { ...resultBoard, project: projectName };

      if (isEditing) {
        setBoards(boards.map((b) => (b.id === finalBoard.id ? finalBoard : b)));
      } else {
        setBoards([...boards, finalBoard]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Submit board error:", error.message || error);
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
                color: "text.primary",
                fontSize: { xs: "1.8rem", sm: "2.4rem" },
                letterSpacing: "-0.5px",
              }}
            >
              {translate("board_title")}
            </Typography>
            <HasRole allowedRoles={["ADMIN", "MANAGER"]}>
              <Button
                variant="contained"
                fullWidth={{ xs: true, sm: false }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setModalOpen(true);
                  setIsEditing(false);
                }}
              >
                {translate("create_board_button")}
              </Button>
            </HasRole>
          </Box>
          <Box
            sx={{
              display: boards.length > 0 ? "grid" : "block",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(280px, 1fr))",
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {boards.length > 0 ? (
              boards.map((board) => (
                <BoardCard
                  key={board.id}
                  boards={boards}
                  setBoards={setBoards}
                  board={board}
                  handleEditStart={handleEditStart}
                  onNotify={triggerNotification}
                />
              ))
            ) : (
              <WarningAlert
                title={translate("no_boards_found_title")}
                message={translate("no_boards_found_message")}
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
      <BoardModal
        open={isModalOpen}
        onClose={handleCloseModal}
        boardName={boardName}
        setBoardName={setBoardName}
        boardDescription={boardDescription}
        setBoardDescription={setBoardDescription}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projectsData={projectsData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        errors={errors}
      />
    </Box>
  );
};

export default BoardsPage;

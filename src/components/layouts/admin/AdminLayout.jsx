import {
  BarChartRounded as DashboardIcon,
  CloseRounded as CloseIcon,
  ExitToAppRounded as ExitToAppIcon,
  GroupsRounded as GroupsIcon,
  MenuRounded as MenuIcon,
  MessageRounded as MessageIcon,
  ShieldRounded as ShieldIcon,
  PeopleAltRounded as UsersIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { adminLogout } from "../../../redux/thunks/admin";

const adminTabs = [
  { name: "Overview", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { name: "Users", path: "/admin/users", icon: <UsersIcon /> },
  { name: "Chats", path: "/admin/chats", icon: <GroupsIcon /> },
  { name: "Messages", path: "/admin/messages", icon: <MessageIcon /> },
];

const pageDetails = {
  "/admin/dashboard": ["Overview", "Your workspace at a glance"],
  "/admin/users": ["Users", "Manage and review your community"],
  "/admin/chats": ["Chats", "Explore conversations across your workspace"],
  "/admin/messages": ["Messages", "Review recent messages and attachments"],
};

const SideBar = ({ onNavigate, mobile = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
    onNavigate?.();
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        px: mobile ? 2.5 : 2,
        py: 3,
        color: "#eef2ff",
        background:
          "radial-gradient(circle at 15% 0%, rgba(99,102,241,.24), transparent 33%), #101426",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1, mb: 4 }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 42,
            height: 42,
            borderRadius: 2.5,
            color: "white",
            bgcolor: "#6366f1",
            boxShadow: "0 8px 20px rgba(99,102,241,.35)",
          }}
        >
          <ShieldIcon />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
            Chatter
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(238,242,255,.52)" }}>
            ADMIN CONSOLE
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="overline"
        sx={{ px: 1.5, mb: 1, color: "rgba(238,242,255,.42)", letterSpacing: 1.4 }}
      >
        Workspace
      </Typography>
      <Stack component="nav" aria-label="Admin navigation" spacing={0.75}>
        {adminTabs.map((tab) => {
          const selected = location.pathname === tab.path;
          return (
            <Button
              key={tab.path}
              component={LinkComponent}
              to={tab.path}
              onClick={onNavigate}
              aria-current={selected ? "page" : undefined}
              startIcon={tab.icon}
              sx={{
                justifyContent: "flex-start",
                minHeight: 48,
                px: 1.75,
                borderRadius: 2.5,
                color: selected ? "#fff" : "rgba(238,242,255,.65)",
                bgcolor: selected ? "rgba(99,102,241,.22)" : "transparent",
                fontWeight: selected ? 700 : 500,
                "& .MuiButton-startIcon": { color: selected ? "#a5b4fc" : "inherit" },
                "&:hover": {
                  color: "#fff",
                  bgcolor: selected ? "rgba(99,102,241,.3)" : "rgba(255,255,255,.07)",
                },
              }}
            >
              {tab.name}
            </Button>
          );
        })}
      </Stack>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: "rgba(255,255,255,.09)", mb: 2 }} />
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          p: 1.25,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,.05)",
        }}
      >
        <Avatar sx={{ width: 36, height: 36, bgcolor: "#3730a3", fontSize: 15 }}>
          A
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            Administrator
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(238,242,255,.5)" }}>
            Workspace owner
          </Typography>
        </Box>
        <Tooltip title="Sign out">
          <IconButton
            aria-label="Sign out"
            onClick={logoutHandler}
            size="small"
            sx={{ color: "rgba(238,242,255,.7)", "&:hover": { color: "#fff" } }}
          >
            <ExitToAppIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [pageTitle, pageSubtitle] = pageDetails[location.pathname] || [
    "Admin",
    "Workspace management",
  ];

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "264px minmax(0, 1fr)" },
        bgcolor: "#f5f6fb",
        color: "#171a2b",
      }}
    >
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <SideBar />
      </Box>

      <Box component="main" sx={{ minWidth: 0 }}>
        <Stack
          component="header"
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            minHeight: 82,
            px: { xs: 2, sm: 3.5, lg: 5 },
            borderBottom: "1px solid #eaebf1",
            bgcolor: alpha("#ffffff", 0.92),
            backdropFilter: "blur(14px)",
          }}
        >
          <IconButton
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "#3730a3" }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={800} letterSpacing={-0.4}>
              {pageTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: "#777b8e" }}>
              {pageSubtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "grid" },
              placeItems: "center",
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "1px solid #e8e9f0",
              color: "#53566b",
              bgcolor: "#fff",
            }}
          >
            <ShieldIcon fontSize="small" />
          </Box>
        </Stack>
        <Box sx={{ px: { xs: 2, sm: 3.5, lg: 5 }, py: { xs: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, border: 0 } }}
      >
        <SideBar mobile onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </Box>
  );
};

export default AdminLayout;

SideBar.propTypes = {
  onNavigate: PropTypes.func,
  mobile: PropTypes.bool,
};

AdminLayout.propTypes = {
  children: PropTypes.node,
};

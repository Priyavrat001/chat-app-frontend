import { TrendingUpRounded as TrendIcon } from "@mui/icons-material";
import { Box, Paper, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const palettes = {
  Users: { color: "#4f46e5", background: "#eeedff" },
  Chats: { color: "#0891b2", background: "#e4f8fc" },
  Messages: { color: "#d97706", background: "#fff4df" },
};

const WighetComponent = ({ title, icon, value }) => {
  const palette = palettes[title] || palettes.Users;

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        flex: "1 1 220px",
        minWidth: { xs: "100%", sm: 190 },
        overflow: "hidden",
        p: 2.5,
        border: "1px solid #e9eaf1",
        borderRadius: 4,
        bgcolor: "#fff",
        boxShadow: "0 12px 34px rgba(31,36,66,.045)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 18px 36px rgba(31,36,66,.09)",
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="body2" fontWeight={600} color="#777b8e">
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing={-1}
            sx={{ mt: 1, color: "#202238" }}
          >
            {(value ?? 0).toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 46,
            height: 46,
            color: palette.color,
            bgcolor: palette.background,
            borderRadius: 3,
            "& svg": { fontSize: 23 },
          }}
        >
          {icon}
        </Box>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 2.25 }}>
        <TrendIcon sx={{ color: palette.color, fontSize: 17 }} />
        <Typography variant="caption" color="#85889b">
          Current total
        </Typography>
      </Stack>
    </Paper>
  );
};

WighetComponent.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  value: PropTypes.number,
};

export default WighetComponent;

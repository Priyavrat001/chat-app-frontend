import { SearchRounded as SearchIcon } from "@mui/icons-material";
import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import PropTypes from "prop-types";

const AdminTableToolbar = ({ heading, rowCount }) => (
  <GridToolbarContainer
    sx={{
      minHeight: 80,
      px: { xs: 1.5, sm: 2.5 },
      py: 1.5,
      display: "flex",
      justifyContent: "space-between",
      gap: 2,
      borderBottom: "1px solid #eff0f5",
    }}
  >
    <Box>
      <Typography variant="subtitle1" fontWeight={800} color="#202238">
        {heading}
      </Typography>
      <Typography variant="caption" color="#85889b">
        {rowCount.toLocaleString()} records
      </Typography>
    </Box>
    <GridToolbarQuickFilter
      debounceMs={250}
      placeholder="Search records"
      quickFilterParser={(value) => value.split(/\s+/).filter(Boolean)}
      InputProps={{
        startAdornment: <SearchIcon sx={{ mr: 1, color: "#85889b", fontSize: 20 }} />,
      }}
      sx={{
        width: { xs: "min(48vw, 220px)", sm: 260 },
        "& .MuiInputBase-root": {
          height: 40,
          px: 1.25,
          border: "1px solid #e7e8ef",
          borderRadius: 2.5,
          bgcolor: "#f8f9fc",
          fontSize: 13,
        },
        "& .MuiInputBase-root:before, & .MuiInputBase-root:after": { display: "none" },
      }}
    />
  </GridToolbarContainer>
);

const Table = ({ rows = [], columns = [], heading, rowHeight = 56 }) => (
  <Paper
    elevation={0}
    sx={{
      minWidth: 0,
      width: "100%",
      height: { xs: "calc(100vh - 190px)", md: "calc(100vh - 190px)" },
      minHeight: 500,
      overflow: "hidden",
      border: "1px solid #e9eaf1",
      borderRadius: 4,
      bgcolor: "#fff",
      boxShadow: "0 12px 34px rgba(31,36,66,.045)",
    }}
  >
    <DataGrid
      rows={rows}
      columns={columns}
      rowHeight={rowHeight}
      disableSelectionOnClick
      pageSize={25}
      rowsPerPageOptions={[10, 25, 50]}
      components={{ Toolbar: AdminTableToolbar }}
      componentsProps={{
        toolbar: { heading, rowCount: rows.length },
      }}
      sx={{
        border: 0,
        color: "#303349",
        "& .MuiDataGrid-columnHeaders": {
          borderBottom: "1px solid #eceef4",
          bgcolor: "#f8f9fc",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          color: "#686c80",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: ".07em",
          textTransform: "uppercase",
        },
        "& .MuiDataGrid-cell": {
          borderColor: "#f0f1f5",
          fontSize: 13,
        },
        "& .MuiDataGrid-row:hover": { bgcolor: "#f8f9ff" },
        "& .MuiDataGrid-footerContainer": {
          minHeight: 58,
          borderTop: "1px solid #eceef4",
        },
        "& .MuiDataGrid-virtualScroller": { overflowX: "auto" },
        "& .table-header": { bgcolor: "#f8f9fc" },
        "& .MuiDataGrid-overlay": { bgcolor: "#fff" },
      }}
      slots={{
        noRowsOverlay: () => (
          <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
            <Typography color="#777b8e">No records to display</Typography>
          </Stack>
        ),
      }}
    />
  </Paper>
);

AdminTableToolbar.propTypes = {
  heading: PropTypes.string,
  rowCount: PropTypes.number,
};

Table.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  heading: PropTypes.string,
  rowHeight: PropTypes.number,
};

export default Table;

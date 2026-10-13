import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PropTypes from "prop-types";

const AdminDataTable = ({ columns, rows, rowKey, emptyMessage = "No records found" }) => (
  <TableContainer component={Paper} elevation={0} sx={{
    border: "1px solid #e9eaf1",
    borderRadius: 3,
    overflowX: "auto",
  }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: "#f8f9fc" }}>
          {columns.map((column) => (
            <TableCell key={column.key} sx={{
              py: 1.5,
              color: "#686c80",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={rowKey(row)} hover>
            {columns.map((column) => (
              <TableCell key={column.key} sx={{ py: 1.5, borderColor: "#f0f1f5" }}>
                {column.render ? column.render(row) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {!rows.length && (
          <TableRow>
            <TableCell colSpan={columns.length} align="center" sx={{ py: 7 }}>
              <Typography color="text.secondary">{emptyMessage}</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

AdminDataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    render: PropTypes.func,
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowKey: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
};

export default AdminDataTable;

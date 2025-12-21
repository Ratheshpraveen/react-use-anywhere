import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

// TypeScript interface for table row data
interface EntryData {
  id: number;
  name: string;
  category: string;
  date: string;
  status: string;
  value: number;
}

// Sample data (in a real app, this would come from an API or state management)
const SAMPLE_ENTRIES: EntryData[] = [
  { 
    id: 1, 
    name: 'Project Alpha', 
    category: 'Development', 
    date: '2023-06-15', 
    status: 'In Progress', 
    value: 5000 
  },
  { 
    id: 2, 
    name: 'Marketing Campaign', 
    category: 'Marketing', 
    date: '2023-06-10', 
    status: 'Completed', 
    value: 3500 
  },
  // Add more sample entries...
];

const EntriesTable: React.FC = () => {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Pagination change handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Action handlers (placeholders)
  const handleEdit = (id: number) => {
    console.log(`Editing entry ${id}`);
    // Implement edit logic
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting entry ${id}`);
    // Implement delete logic
  };

  // Slice data for pagination
  const paginatedEntries = SAMPLE_ENTRIES.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="entries table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Value</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEntries.map((entry) => (
              <TableRow key={entry.id} hover>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.status}</TableCell>
                <TableCell>${entry.value.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(entry.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      color="secondary" 
                      onClick={() => handleDelete(entry.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={SAMPLE_ENTRIES.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EntriesTable;

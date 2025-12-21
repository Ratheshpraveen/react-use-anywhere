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
  Chip
} from '@mui/material';

// Placeholder data for entries
interface Entry {
  id: number;
  project: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  deadline: string;
  team: string;
  progress: number;
}

const initialEntries: Entry[] = [
  {
    id: 1,
    project: 'Dashboard Redesign',
    status: 'In Progress',
    deadline: '2023-09-15',
    team: 'Frontend',
    progress: 65,
  },
  {
    id: 2,
    project: 'Mobile App',
    status: 'Completed',
    deadline: '2023-08-30',
    team: 'Mobile',
    progress: 100,
  },
  {
    id: 3,
    project: 'Backend API',
    status: 'Pending',
    deadline: '2023-10-01',
    team: 'Backend',
    progress: 25,
  },
  // Add more entries as needed
];

const EntriesTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: Entry['status']) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'default';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialEntries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.project}</TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.status} 
                      color={getStatusColor(entry.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{entry.deadline}</TableCell>
                  <TableCell>{entry.team}</TableCell>
                  <TableCell>{entry.progress}%</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={initialEntries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EntriesTable;

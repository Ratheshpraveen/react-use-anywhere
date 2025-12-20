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
  Box,
  Typography,
  Chip
} from '@mui/material';

// Define interface for table row data
interface TableRowData {
  id: number;
  name: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
  deadline: string;
}

// Mock data for the table
const mockTableData: TableRowData[] = [
  { 
    id: 1, 
    name: 'Project Alpha', 
    status: 'active', 
    progress: 65, 
    deadline: '2023-12-15' 
  },
  { 
    id: 2, 
    name: 'Marketing Campaign', 
    status: 'pending', 
    progress: 35, 
    deadline: '2023-11-30' 
  },
  { 
    id: 3, 
    name: 'Product Launch', 
    status: 'completed', 
    progress: 100, 
    deadline: '2023-10-20' 
  },
  { 
    id: 4, 
    name: 'Website Redesign', 
    status: 'active', 
    progress: 45, 
    deadline: '2024-01-10' 
  },
  { 
    id: 5, 
    name: 'Customer Research', 
    status: 'pending', 
    progress: 20, 
    deadline: '2023-12-05' 
  }
];

const DataTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: TableRowData['status']) => {
    switch (status) {
      case 'active': return 'primary';
      case 'pending': return 'warning';
      case 'completed': return 'success';
    }
  };

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="right">Deadline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockTableData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {`${row.progress}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.deadline}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={mockTableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;

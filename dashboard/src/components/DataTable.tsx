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
  Card,
  CardContent
} from '@mui/material';

interface ProjectData {
  id: number;
  name: string;
  status: string;
  progress: number;
  team: string;
}

const DataTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const mockProjectData: ProjectData[] = [
    { id: 1, name: 'Web Redesign', status: 'In Progress', progress: 65, team: 'Frontend' },
    { id: 2, name: 'Mobile App', status: 'Completed', progress: 100, team: 'Mobile' },
    { id: 3, name: 'Backend API', status: 'Planning', progress: 20, team: 'Backend' },
    { id: 4, name: 'Design System', status: 'In Progress', progress: 75, team: 'Design' },
    { id: 5, name: 'Marketing Site', status: 'Completed', progress: 100, team: 'Marketing' },
    { id: 6, name: 'Customer Portal', status: 'In Progress', progress: 50, team: 'Fullstack' },
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project ID</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Team</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockProjectData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>{project.progress}%</TableCell>
                    <TableCell>{project.team}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={mockProjectData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default DataTable;

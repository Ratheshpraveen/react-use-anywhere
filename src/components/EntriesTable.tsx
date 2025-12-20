import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

// Mock data interface
interface EntryData {
  id: number;
  projectName: string;
  status: string;
  progress: number;
  deadline: string;
  assignedTo: string;
}

// Generate mock data
const generateMockData = (): EntryData[] => {
  return [
    {
      id: 1,
      projectName: 'Dashboard Redesign',
      status: 'In Progress',
      progress: 65,
      deadline: '2023-12-15',
      assignedTo: 'John Doe'
    },
    {
      id: 2,
      projectName: 'Mobile App Development',
      status: 'Completed',
      progress: 100,
      deadline: '2023-11-30',
      assignedTo: 'Jane Smith'
    },
    {
      id: 3,
      projectName: 'Backend Optimization',
      status: 'Not Started',
      progress: 0,
      deadline: '2024-01-20',
      assignedTo: 'Mike Johnson'
    },
    {
      id: 4,
      projectName: 'UX Research',
      status: 'In Review',
      progress: 85,
      deadline: '2023-12-10',
      assignedTo: 'Sarah Williams'
    },
    {
      id: 5,
      projectName: 'Marketing Campaign',
      status: 'On Hold',
      progress: 40,
      deadline: '2024-02-05',
      assignedTo: 'Alex Brown'
    }
  ];
};

const EntriesTable: React.FC = () => {
  const [rows] = useState<EntryData[]>(generateMockData());

  // Define columns for the data grid
  const columns: GridColDef[] = [
    { 
      field: 'projectName', 
      headerName: 'Project Name', 
      width: 200,
      flex: 1 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => {
        let color = 'default';
        switch (params.value) {
          case 'Completed':
            color = 'green';
            break;
          case 'In Progress':
            color = 'blue';
            break;
          case 'Not Started':
            color = 'gray';
            break;
          case 'In Review':
            color = 'orange';
            break;
          case 'On Hold':
            color = 'red';
            break;
        }
        return (
          <Box 
            sx={{ 
              color: color, 
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: `${color}10`
            }}
          >
            {params.value}
          </Box>
        );
      }
    },
    { 
      field: 'progress', 
      headerName: 'Progress', 
      width: 110,
      renderCell: (params) => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: `${params.value}%`, 
              height: '10px', 
              backgroundColor: 'primary.main',
              borderRadius: '5px',
              marginRight: '8px'
            }} 
          />
          <Typography variant="body2">{params.value}%</Typography>
        </Box>
      )
    },
    { 
      field: 'deadline', 
      headerName: 'Deadline', 
      width: 120 
    },
    { 
      field: 'assignedTo', 
      headerName: 'Assigned To', 
      width: 150,
      flex: 1 
    }
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        components={{
          Toolbar: GridToolbar,
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            fontWeight: 'bold'
          }
        }}
      />
    </Box>
  );
};

export default EntriesTable;

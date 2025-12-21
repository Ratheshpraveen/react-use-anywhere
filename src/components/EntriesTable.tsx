import React from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridRowsProp,
  GridToolbar 
} from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  Paper 
} from '@mui/material';

// Mock data for entries
const rows: GridRowsProp = [
  { 
    id: 1, 
    project: 'Dashboard Redesign', 
    status: 'In Progress', 
    priority: 'High', 
    assignee: 'John Doe', 
    dueDate: '2023-12-15' 
  },
  { 
    id: 2, 
    project: 'Mobile App Update', 
    status: 'Pending', 
    priority: 'Medium', 
    assignee: 'Jane Smith', 
    dueDate: '2024-01-20' 
  },
  { 
    id: 3, 
    project: 'Backend Optimization', 
    status: 'Completed', 
    priority: 'Low', 
    assignee: 'Mike Johnson', 
    dueDate: '2023-11-30' 
  },
  { 
    id: 4, 
    project: 'Security Audit', 
    status: 'In Progress', 
    priority: 'Critical', 
    assignee: 'Sarah Williams', 
    dueDate: '2024-02-10' 
  },
  { 
    id: 5, 
    project: 'UX Research', 
    status: 'Planning', 
    priority: 'Low', 
    assignee: 'Emily Brown', 
    dueDate: '2024-03-05' 
  }
];

// Column definitions
const columns: GridColDef[] = [
  { 
    field: 'project', 
    headerName: 'Project', 
    width: 200,
    editable: false 
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    cellClassName: (params) => {
      if (!params.value) return '';
      
      switch(params.value) {
        case 'Completed':
          return 'status-completed';
        case 'In Progress':
          return 'status-in-progress';
        case 'Pending':
          return 'status-pending';
        case 'Planning':
          return 'status-planning';
        default:
          return '';
      }
    }
  },
  { 
    field: 'priority', 
    headerName: 'Priority', 
    width: 120,
    cellClassName: (params) => {
      if (!params.value) return '';
      
      switch(params.value) {
        case 'Critical':
          return 'priority-critical';
        case 'High':
          return 'priority-high';
        case 'Medium':
          return 'priority-medium';
        case 'Low':
          return 'priority-low';
        default:
          return '';
      }
    }
  },
  { 
    field: 'assignee', 
    headerName: 'Assignee', 
    width: 180 
  },
  { 
    field: 'dueDate', 
    headerName: 'Due Date', 
    width: 150 
  }
];

const EntriesTable: React.FC = () => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: 500, 
        width: '100%', 
        marginTop: 3 
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: 2 
        }}
      >
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1 }}
        >
          Project Entries
        </Typography>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        sx={{
          '& .status-completed': {
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            color: 'green'
          },
          '& .status-in-progress': {
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            color: 'orange'
          },
          '& .status-pending': {
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            color: 'red'
          },
          '& .status-planning': {
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            color: 'blue'
          },
          '& .priority-critical': {
            fontWeight: 'bold',
            color: 'darkred'
          },
          '& .priority-high': {
            color: 'red'
          },
          '& .priority-medium': {
            color: 'orange'
          },
          '& .priority-low': {
            color: 'green'
          }
        }}
      />
    </Paper>
  );
};

export default EntriesTable;

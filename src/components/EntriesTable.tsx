import React, { useState } from 'react';
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

// Mock data for the entries table
const initialRows: GridRowsProp = [
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
    status: 'Completed', 
    priority: 'Medium', 
    assignee: 'Jane Smith', 
    dueDate: '2023-11-30' 
  },
  { 
    id: 3, 
    project: 'Backend Optimization', 
    status: 'Pending', 
    priority: 'Low', 
    assignee: 'Mike Johnson', 
    dueDate: '2024-01-20' 
  },
  { 
    id: 4, 
    project: 'UX Research', 
    status: 'In Progress', 
    priority: 'High', 
    assignee: 'Sarah Williams', 
    dueDate: '2023-12-10' 
  },
  { 
    id: 5, 
    project: 'Security Audit', 
    status: 'Not Started', 
    priority: 'Critical', 
    assignee: 'Alex Brown', 
    dueDate: '2024-02-01' 
  }
];

const EntriesTable: React.FC = () => {
  const [rows, setRows] = useState(initialRows);

  // Define columns with sorting and filtering capabilities
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
      editable: false,
      // Custom filtering for status
      filterOperators: [
        {
          label: 'Equals',
          value: 'equals',
          getApplyFilterFn: (filterValue) => {
            return ({ value }) => value === filterValue;
          },
        }
      ]
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 120, 
      editable: false 
    },
    { 
      field: 'assignee', 
      headerName: 'Assignee', 
      width: 180, 
      editable: false 
    },
    { 
      field: 'dueDate', 
      headerName: 'Due Date', 
      width: 150, 
      type: 'date',
      editable: false 
    }
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: 500, 
        width: '100%', 
        marginTop: 3 
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          padding: 2, 
          paddingBottom: 0 
        }}
      >
        Project Entries
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{
          toolbar: GridToolbar,
        }}
        sx={{
          '& .MuiDataGrid-toolbarContainer': {
            backgroundColor: '#f5f5f5',
          }
        }}
        initialState={{
          pagination: { 
            paginationModel: { pageSize: 5 } 
          },
        }}
      />
    </Paper>
  );
};

export default EntriesTable;

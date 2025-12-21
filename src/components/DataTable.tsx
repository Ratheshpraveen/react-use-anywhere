import React, { useState } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar,
  GridSortModel,
  GridFilterModel 
} from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  useTheme 
} from '@mui/material';

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
      status: 'In Progress', 
      progress: 40, 
      deadline: '2023-12-10', 
      assignedTo: 'Sarah Williams' 
    },
    { 
      id: 5, 
      projectName: 'API Integration', 
      status: 'In Review', 
      progress: 85, 
      deadline: '2023-12-05', 
      assignedTo: 'Alex Brown' 
    }
  ];
};

const DataTable: React.FC = () => {
  const theme = useTheme();
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  // Define columns with type definitions
  const columns: GridColDef[] = [
    { 
      field: 'projectName', 
      headerName: 'Project Name', 
      flex: 1,
      minWidth: 150 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => {
        const getStatusColor = () => {
          switch(params.value) {
            case 'Completed': return 'success.main';
            case 'In Progress': return 'warning.main';
            case 'Not Started': return 'error.main';
            case 'In Review': return 'info.main';
            default: return 'text.secondary';
          }
        };

        return (
          <Box 
            sx={{ 
              color: getStatusColor(),
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
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
      type: 'number', 
      width: 110,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2">
            {params.value}%
          </Typography>
        </Box>
      )
    },
    { 
      field: 'deadline', 
      headerName: 'Deadline', 
      type: 'date', 
      width: 120 
    },
    { 
      field: 'assignedTo', 
      headerName: 'Assigned To', 
      flex: 1,
      minWidth: 150 
    }
  ];

  // Fetch mock data
  const rows = generateMockData();

  return (
    <Box 
      sx={{ 
        height: 400, 
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
          backgroundColor: theme.palette.background.paper,
        },
        '& .MuiDataGrid-cell': {
          borderBottom: 'none',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  );
};

export default DataTable;

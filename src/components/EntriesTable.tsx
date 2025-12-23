import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Chip, styled } from '@mui/material';

// Define Entry Data Interface
interface Entry {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Pending';
  date: Date;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
}

// Placeholder data for the table
const initialEntries: Entry[] = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'Initial development phase',
    status: 'Active',
    date: new Date('2023-01-15'),
    category: 'Software Development', 
    priority: 'High'
  },
  {
    id: 2,
    name: 'Marketing Campaign',
    description: 'Brand awareness initiative',
    status: 'Pending',
    date: new Date('2023-02-20'),
    category: 'Marketing',
    priority: 'Medium'
  }
];

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  color: theme.palette.text.primary,
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.palette.background.default,
    fontWeight: 'bold'
  },
  '& .MuiDataGrid-row': {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    }
  }
}));

const EntriesTable: React.FC = () => {
  const [rows, setRows] = useState<Entry[]>(initialEntries);

  const columns: GridColDef<Entry>[] = [
    {  
      field: 'name', 
      headerName: 'Project Name', 
      width: 200,
      sortable: true
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 300,
      flex: 1
    },
    {
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: ({ value }) => (
        <Chip 
          label={value}
          color={value === 'Active' ? 'success' : 'warning'}
          size="small"
        />
      )
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'category',
      headerName: 'Category', 
      width: 150
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      renderCell: ({ value }) => (
        <Chip 
          label={value}
          color={
            value === 'High' ? 'error' : 
            value === 'Medium' ? 'warning' : 'default'
          }
          size="small"
        />
      )
    }
  ];

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      <StyledDataGrid 
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

export default EntriesTable;

import React, { useState } from 'react';
import { useCustomSWR } from '../hooks/useCustomSWR';

// Define an interface for the data type
interface User {
  id: number;
  name: string;
  email: string;
}

export const ExampleDataFetcher: React.FC = () => {
  // Example API endpoint (replace with your actual endpoint)
  const API_URL = 'https://jsonplaceholder.typicode.com/users';

  // Use the custom SWR hook
  const { 
    data, 
    error, 
    isValidating, 
    updateFilters, 
    resetFilters 
  } = useCustomSWR<User[]>(API_URL, {
    initialParams: { 
      page: 1, 
      limit: 10 
    }
  });

  // State for local filtering
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Update filters dynamically
    updateFilters({ search: term });
  };

  // Render loading state
  if (isValidating) return <div>Loading...</div>;

  // Render error state
  if (error) return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetFilters}>Reset</button>
    </div>
  );

  // Render data
  return (
    <div>
      <input 
        type="text" 
        placeholder="Search users" 
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {data && data.length > 0 ? (
        <ul>
          {data.map(user => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

import React from 'react';
import { useSWRFetch } from '../../hooks/useSWRFetch';

const SWRExample = () => {
  const API_URL = 'https://jsonplaceholder.typicode.com/posts/1';
  
  const { 
    data, 
    error, 
    isLoading, 
    mutate 
  } = useSWRFetch(API_URL);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const handleRefresh = () => {
    mutate(); // Manually trigger revalidation
  };

  return (
    <div>
      <h2>Post Details</h2>
      {data && (
        <>
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Body:</strong> {data.body}</p>
          <button onClick={handleRefresh}>
            Refresh Data
          </button>
        </>
      )}
    </div>
  );
};

export default SWRExample;

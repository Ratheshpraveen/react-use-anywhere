import React from 'react';
import { SWRConfig } from 'swr';
import { fetcher } from './utils/fetcher';
import SWRExample from './components/examples/SWRExample';

function App() {
  const swrConfig = {
    fetcher,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
    errorRetryInterval: 5000,
    errorRetryCount: 3,
  };

  return (
    <SWRConfig value={swrConfig}>
      <div className="App">
        <h1>SWR Data Fetching Example</h1>
        <SWRExample />
      </div>
    </SWRConfig>
  );
}

export default App;

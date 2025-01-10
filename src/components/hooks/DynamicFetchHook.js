import { useState, useEffect } from 'react';
import { message } from 'antd';

/**
 * Custom hook to fetch data dynamically
 * @param {string} endpoint - The API endpoint to fetch data from
 * @param {object} apiService - The API service to use for fetching data
 * @returns {object} - The data, loading state and error state
 * @example
 * const { data, loading, error } = useFetchAsync('/api/endpoint', apiService);
 * const { data, loading, error } = useFetchAsync(userManagementEndpoints.getTenantUsers, apiService);
 */
const useFetchAsync = (endpoint, apiService) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.get(endpoint, {
          'paging.pageSize': 1000,
        });
        setData(response.data.data);
      } catch (err) {
        console.log(
          `An error occurred in useFetchAsync while fetching data from ${endpoint}`,
          err
        );
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (endpoint && apiService) {
      fetchData();
    }
  }, [endpoint, apiService]); // Re-fetch only if endpoint or apiService changes

  return { data };
};

export default useFetchAsync;

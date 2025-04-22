// hooks/useDocumentBase64.js
import { useEffect, useState } from 'react';

export function useDocumentBase64(id) {
  const [base64, setBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBase64 = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://192.168.3.66:8000/api/v4/documents/${id}/files/${id}/download/`,
          {
            headers: {
              Authorization: `Basic ${btoa('admin:N9HxxWtq:8g_4jb')}`, // Add Basic Auth
            },
          }
        );

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        setBase64(base64);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBase64();
  }, [id]);

  return { base64, loading, setLoading, error };
}

import { Backdrop } from '@mui/material';
import { useDocumentBase64 } from '../hooks/useDocumentBase64';

export default function BaseEdmsViewer({ docId }) {
  const { base64, loading, setLoading, error } = useDocumentBase64(docId);

  if (loading)
    return (
      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: 999999 }}
          open={loading}
          onClick={() => setLoading(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-xl flex items-center">
            Generating Document Preview
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      </div>
    );
  if (error) return <div>Error loading document: {error}</div>;
  if (!base64) return null;

  return (
    <iframe
      src={`data:application/pdf;base64,${base64}`}
      width="100%"
      height="800px"
      title="Document Preview"
    />
  );
}

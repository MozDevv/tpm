const ChangesView = ({ data }) => {
  const sections = [
    'BASIC_DETAILS',
    'WORK_HISTORY',
    'GOVERNMENT_SALARY',
    'DEDUCTIONS',
    'WCPS',
    'PARLIAMENTARY_CONTRIBUTIONS',
    'LIABILITIES',
    'MAINTENANCE',
  ];

  if (!data) {
    return <p>No data available</p>;
  }

  const {
    sectionsEnabled = [], // Fallback to an empty array if undefined
    sectionsUpdated = [], // Fallback to an empty array if undefined
    basicDetailFields = [], // Fallback to an empty array if undefined
    prospective_pensioner = null, // Fallback to null if undefined
  } = data;

  const renderSection = (sectionId) => {
    const sectionName = sections[sectionId] || `Section ${sectionId}`;
    const isUpdated = sectionsUpdated.includes(sectionId);
    const sectionStyle = isUpdated
      ? { backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px' }
      : {};

    return (
      <div key={sectionId} style={sectionStyle}>
        <h3>{sectionName}</h3>
        {basicDetailFields.length > 0 ? (
          <ul>
            {basicDetailFields.map((field) => (
              <li key={field}>
                <strong>{field.replace(/_/g, ' ').toUpperCase()}:</strong>{' '}
                {prospective_pensioner
                  ? prospective_pensioner[field] || 'No data'
                  : 'No data'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No fields to display</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Changes Summary</h2>
      {sectionsEnabled.length > 0 ? (
        sectionsEnabled.map((sectionId) => renderSection(sectionId))
      ) : (
        <p>No sections enabled</p>
      )}
    </div>
  );
};

export default ChangesView;

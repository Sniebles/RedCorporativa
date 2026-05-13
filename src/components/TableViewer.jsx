const TableViewer = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="table-viewer">No data to display</div>;
  }

  const keys = Object.keys(data[0]);

  return (
    <div className="table-viewer">
      <table>
        <thead>
          <tr>
            {keys.map(key => (
              <th key={key}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {keys.map(key => (
                <td key={key}>
                  {Array.isArray(item[key]) ? item[key].join(', ') : JSON.stringify(item[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableViewer;
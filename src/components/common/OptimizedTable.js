import React, { useMemo, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import VirtualList from './VirtualList';

const OptimizedTable = ({ 
  data, 
  columns, 
  itemHeight = 60,
  containerHeight = 400,
  sortable = true,
  virtualized = false
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = useCallback((key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, [sortable]);

  const renderTableHeader = () => (
    <thead>
      <tr>
        {columns.map((column) => (
          <th 
            key={column.key}
            onClick={() => handleSort(column.key)}
            className={sortable ? 'sortable' : ''}
            style={{ cursor: sortable ? 'pointer' : 'default' }}
          >
            <div className="th-content">
              {column.title}
              {sortable && sortConfig.key === column.key && (
                sortConfig.direction === 'asc' ? 
                  <ChevronUp size={16} /> : 
                  <ChevronDown size={16} />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderTableRow = useCallback((item, index) => (
    <tr key={item.id || index}>
      {columns.map((column) => (
        <td key={column.key}>
          {column.render ? column.render(item[column.key], item, index) : item[column.key]}
        </td>
      ))}
    </tr>
  ), [columns]);

  if (virtualized && data.length > 100) {
    return (
      <div className="optimized-table virtualized">
        <table>
          {renderTableHeader()}
        </table>
        <VirtualList
          items={sortedData}
          itemHeight={itemHeight}
          containerHeight={containerHeight}
          renderItem={renderTableRow}
        />
      </div>
    );
  }

  return (
    <div className="optimized-table">
      <table>
        {renderTableHeader()}
        <tbody>
          {sortedData.map((item, index) => renderTableRow(item, index))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(OptimizedTable);
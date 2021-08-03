import React from 'react';
import {
  useTable, useSortBy, usePagination, useGlobalFilter,
} from 'react-table';
import TableStyles from './TableStyle';
import PropTypes from 'prop-types';

/**
 *
 * @param {Array} columns - an array of table columns.
 * @param {Array} data - an array of data for the table.
 * @param {boolean} disablePagination - a boolean value to whether disable the pagination or not.
 */
const Table = ({ columns, data, disablePagination = false }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0 },
  },
    useGlobalFilter,
    useSortBy,
    usePagination);

  /**
   * Function to format and render table rows.
   * Handles merging of cells with an identical value.
   * In order for the merge to work, the values need to be sorted.
   * @returns rows to be rendered
   */
  const renderRows = () => {
    // Get all the columns that are marked as merged
    let mergedCols = columns.filter(col => col.merged);

    // Count the number of values to be merged
    for(let col of mergedCols){
      let values = data.map(item => item[col.accessor]);
      col.mergedValues = [...new Set(values)].map(item => ({
        value: item, // Unique cell value
        count: values.filter(value => value === item).length, // Count of the value
        rendered: false // Indicates whether the value has been rendered or not.
      }));
    }

    let rows = page.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {
            row.cells.map(
              (cell) => {
                let rowSpan = 0;
                /**
                 * If a column is marked as merged,
                 *  1. Find the values to be merged.
                 *  2. Set the rowSpan to the number of occurences of the merged value.
                 *  3. Set the rendered property as true (rendered only once)
                 */
                if(cell.column.merged){
                  let merged = mergedCols.find(item => cell.column.id === item.accessor)
                                .mergedValues.find(item => item.value === cell.value);
                  if(merged.count > 1){
                    if(!merged.rendered){
                      rowSpan = merged.count;
                      merged.rendered = true;
                    }
                  }else{
                    rowSpan = 1;
                  }
                }else{
                  rowSpan = 1
                }
                return rowSpan > 0 ?
                <td className={cell.column.center ? 'center' : ''}{...cell.getCellProps()} rowSpan={rowSpan}>
                  {cell.render('Cell')}
                </td>
                :
                undefined
              }
            )
          }
        </tr>
      );
    });
    return (rows)
  }

  // Render the UI for your table
  return (
    <TableStyles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                  </th>
                ))
              }
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            renderRows()
          }
        </tbody>
      </table>
    </TableStyles>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(Object).isRequired,
  data: PropTypes.arrayOf(Object).isRequired,
  disablePagination: PropTypes.bool,
};

Table.defaultProps = {
  data: [],
  columns: [],
  disablePagination: false,
};

export default Table;

import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {scrollbarWidth} from '../constants';
import Th from './Th';
import TableCheckBox from './TableCheckBox';
import styles from './Thead.scss';

class Thead extends Component {
  static propTypes = {
    tableId: PropTypes.string,
    // layout
    tableStyles: PropTypes.arrayOf(
      PropTypes.oneOf([
        'inverse',
        'striped',
        'bordered',
        'hover'
      ])
    ),
    columnMinWidth: PropTypes.number,
    flexColumnWidth: PropTypes.number,
    hasRightScrollbar: PropTypes.bool,
    rowWidth: PropTypes.number,
    minRowWidth: PropTypes.number,
    rowHeight: PropTypes.number,
    showScrollbarField: PropTypes.bool,
    // main data
    columns: PropTypes.arrayOf(PropTypes.object),
    items: PropTypes.array.isRequired,
    // sorting
    sortStatus: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    sortFields: PropTypes.arrayOf(PropTypes.string),
    sortDirections: PropTypes.object,
    multiSort: PropTypes.bool,
    // column reordering
    isDragging: PropTypes.bool,
    dragStartIndex: PropTypes.number,
    onColumnOrderChange: PropTypes.func,
    // select items by checkbox
    selectedItems: PropTypes.array,
    selectedBy: PropTypes.arrayOf(PropTypes.string),
    onSelectionChange: PropTypes.func,
    disableSelection: PropTypes.func,
    actions: PropTypes.object,
    idProperty: PropTypes.string.isRequired
  };
  render() {
    const {
      tableId,
      tableStyles,
      rowWidth,
      minRowWidth,
      columnMinWidth,
      flexColumnWidth,
      hasRightScrollbar,
      rowHeight,
      showScrollbarField,
      columns,
      items,
      sortStatus,
      sortFields,
      sortDirections,
      multiSort,
      onSortChange,
      selectedItems,
      selectedBy,
      onSelectionChange,
      disableSelection,
      isDragging,
      tempColumns,
      dragStartIndex,
      onColumnOrderChange,
      actions,
      idProperty
    } =  this.props;
    return (
      <div
        id={`thead-${tableId}`}
        className={classNames(
          styles['thead'],
          tableStyles.map(style => styles[`thead-${style}`])
        )}
      >
        <div
          className={classNames(
            styles['tr'],
            tableStyles.map(style => styles[`tr-${style}`])
          )}
        >
          {onSelectionChange && selectedBy.indexOf('checkbox') > -1 &&
            <TableCheckBox
              rowHeight={rowHeight}
              items={items}
              selectedItems={selectedItems}
              isSelectAll={true}
              onSelectionChange={onSelectionChange}
              disableSelection={disableSelection}
              idProperty={idProperty}
            />
          }
          {tempColumns && tempColumns.map((columnConfig, index) => {
            const columnName = columnConfig.get('name');
            let sortable;
            if(onSortChange) {
              if(!sortFields) {
                sortable = true;
              }
              else if(sortFields.length) {
                sortable = !!sortFields
                  //.find(sortField => sortField === columnName);
                  .filter(sortField => sortField === columnName).length;
              }
            }
            const sort = sortStatus &&
              (
                Array.isArray(sortStatus)
                  ? sortStatus
                      //.find(sortItem => sortItem.name === columnName);
                      .filter(sortItem => sortItem.name === columnName)[0]
                  : sortStatus.name === columnName
                      ? sortStatus
                      : undefined
              );
            return (
              <Th
                tableId={tableId}
                width={columnConfig.get('width') || flexColumnWidth}
                columnMinWidth={columnMinWidth}
                rowHeight={rowHeight}
                columnConfig={columnConfig}
                sort={sort}
                sortable={sortable}
                index={index}
                isDragging={
                  isDragging
               && columns[dragStartIndex]
               && columns[dragStartIndex].name === columnName
                }
                onColumnOrderChange={onColumnOrderChange}
                actions={actions}
                key={columnName}
              />
            );
          })}
          {showScrollbarField &&
            <div
              className={styles['th']}
            >
              <div
                style={{
                  width: (
                    scrollbarWidth
                  - (tableStyles.indexOf('bordered') > -1
                      ? 1
                      : 0
                    )
                  ),
                  height: rowHeight,
                  padding: 0
                }}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Thead;

import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {scrollbarWidth} from '../constants';
import Th from './Th';
import TableCheckBox from './TableCheckBox';
import styles from './Thead.scss';

class Thead extends Component {
  static propTypes = {
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
    sortDirections: PropTypes.arrayOf(PropTypes.object),
    multiSort: PropTypes.bool,
    // column reordering
    isDragging: PropTypes.bool,
    dragStartIndex: PropTypes.number,
    onColumnOrderChange: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    // select items by checkbox
    selectedItems: PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    selectedBy: PropTypes.arrayOf(PropTypes.string),
    onSelectionChange: PropTypes.func,
    disableSelection: PropTypes.func,
    idProperty: PropTypes.string.isRequired
  };
  render() {
    const {
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
      onDragStart,
      onDrag,
      onDragEnd,
      idProperty,
      immutableData
    } =  this.props;
    return (
      <div className={styles['thead']}>
        <div
          className={classNames(
            styles['tr'],
            tableStyles.map(style => styles[`tr-${style}`])
          )}
        >
          {onSelectionChange && selectedBy.indexOf('CHECKBOX') > -1 &&
            <TableCheckBox
              items={items}
              selectedItems={selectedItems}
              isSelectAll={true}
              onSelectionChange={onSelectionChange}
              disableSelection={disableSelection}
              idProperty={idProperty}
            />
          }
          {tempColumns.map((columnConfig, index) => {
            let sortable;
            if(onSortChange) {
              if(!sortFields) {
                sortable = true;
              }
              else if(sortFields.length) {
                sortable = !!sortFields
                  //.find(sortField => sortField === columnConfig.name);
                  .filter(sortField => sortField === columnConfig.name).length;
              }
            }
            const sort = sortStatus &&
              (
                Array.isArray(sortStatus)
                  ? sortStatus
                      //.find(sortItem => sortItem.name === columnConfig.name);
                      .filter(sortItem => sortItem.name === columnConfig.name)[0]
                  : sortStatus.name === columnConfig.name
                      ? sortStatus
                      : undefined
              );
            return (
              <Th
                width={columnConfig.width || flexColumnWidth}
                columnMinWidth={columnMinWidth}
                rowHeight={rowHeight}
                columnConfig={columnConfig}
                sort={sort}
                sortable={sortable}
                index={index}
                isDragging={
                  isDragging
               && columns[dragStartIndex]
               && columns[dragStartIndex].name === columnConfig.name
                }
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                onColumnOrderChange={onColumnOrderChange}
                key={columnConfig.name}
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
                  height: rowHeight
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

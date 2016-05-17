import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import shortid from 'shortid';
import FaSpinner from 'react-icons/lib/fa/spinner';
import {scrollbarWidth} from '../constants';
import * as actions from '../actions/table';
import tableStore from '../stores/table';
import Thead from './TheadContainer';
import Tbody from './TbodyContainer';
import styles from './Table.scss';

class Table extends Component {
  static propTypes = {
    tableId: PropTypes.string,
    // layout
    className: PropTypes.string,
    tableStyles: PropTypes.arrayOf(
      PropTypes.oneOf([
        'inverse',
        'striped',
        'bordered',
        'hover'
      ])
    ).isRequired,
    height: PropTypes.number,
    headerHeight: PropTypes.number,
    maxRowWidth: PropTypes.number,
    minRowWidth: PropTypes.number,
    columnMinWidth: PropTypes.number,
    flexColumnWidth: PropTypes.number,
    hasRightScrollbar: PropTypes.bool,
    rowHeight: PropTypes.number,
    itemPadding: PropTypes.number,
    // main data
    columns: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    // sorting
    sortStatus: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    sortFields: PropTypes.arrayOf(PropTypes.string),
    sortDirections: PropTypes.object,
    multiSort: PropTypes.bool,
    onSortChange: PropTypes.func,
    // column reordering
    onColumnOrderChange: PropTypes.func,
    // select items by checkbox
    selectedItems: PropTypes.array,
    selectedBy: PropTypes.arrayOf(
      PropTypes.oneOf(['checkbox', 'row'])
    ),
    onSelectionChange: PropTypes.func,
    disableSelection: PropTypes.func,
    //
    idProperty: PropTypes.string,
    emptyText: PropTypes.string,
    isLoading: PropTypes.bool
  };
  render() {
    const {
      tableId,
      tableStyles,
      className,
      columnMinWidth,
      flexColumnWidth,
      hasRightScrollbar,
      maxRowWidth,
      minRowWidth,
      headerHeight,
      rowHeight,
      itemPadding,
      columns,
      items,
      sortStatus,
      sortFields,
      sortDirections,
      multiSort,
      onSortChange,
      onColumnOrderChange,
      selectedItems,
      selectedBy,
      onSelectionChange,
      disableSelection,
      idProperty,
      emptyText,
      isLoading
    } = this.props;
    let {height} = this.props;
    if(height > 0) {
      height = height
        - (headerHeight || rowHeight) // theadHeight
        // - tfootHeight
        - 3;
    }
    return (
      <div
        id={`table-${tableId}`}
        className={classNames(
          styles['table'],
          tableStyles.map(style => styles[`table-${style}`]),
          className
        )}
      >
        <Thead
          ref="thead"
	  tableId={tableId}
          tableStyles={tableStyles}
          columnMinWidth={columnMinWidth}
          flexColumnWidth={flexColumnWidth}
          rowWidth={maxRowWidth}
          minRowWidth={minRowWidth}
          rowHeight={headerHeight || rowHeight}
          showScrollbarField={hasRightScrollbar}
          columns={columns}
          items={items}
          sortStatus={sortStatus}
          sortFields={sortFields}
          sortDirections={sortDirections}
          multiSort={multiSort}
          onSortChange={onSortChange}
          onColumnOrderChange={onColumnOrderChange}
          selectedItems={selectedItems}
          selectedBy={selectedBy}
          onSelectionChange={onSelectionChange}
          disableSelection={disableSelection}
          idProperty={idProperty}
        />
        <Tbody
          ref="tableBody"
	  tableId={tableId}
          tableStyles={tableStyles}
          height={height}
          columnMinWidth={columnMinWidth}
          flexColumnWidth={flexColumnWidth}
          maxRowWidth={maxRowWidth}
          minRowWidth={minRowWidth}
          rowHeight={rowHeight}
          hasRightScrollbar={hasRightScrollbar}
          itemPadding={itemPadding}
          columns={columns}
          items={items}
          selectedItems={selectedItems}
          selectedBy={selectedBy}
          onSelectionChange={onSelectionChange}
          disableSelection={disableSelection}
          emptyText={emptyText}
          idProperty={idProperty}
        />
        {isLoading &&
          <div className={styles['loading-mask']}/>
        }
        {isLoading &&
          <div className={styles['loading-icon-container']}>
            <FaSpinner className={styles['loading-icon']}/>
          </div>
        }
      </div>
    );
  }
}

class TableContainer extends Component {
  state = {};
  static defaultProps = {
    tableStyles: [],
    columnMinWidth: 100,
    rowHeight: 37,
    itemPadding: 3,
    selectedBy: ['checkbox'],
    idProperty: 'id'
  };
  constructor(props) {
    super(props);
    this._updateState = ::this._updateState;
    this._updateMinRowWidth = ::this._updateMinRowWidth;
  }
  componentWillMount() {
    this.tableId = shortid.generate();
    actions.createTable(this.tableId);
  }
  componentDidMount() {
    tableStore.addListener('change', this._updateState);
    this._updateMinRowWidth();
  }
  componentWillUmount() {
    tableStore.removeListener('change', this._updateState);
  }
  componentWillReceiveProps() {
    this._updateMinRowWidth();
  }
  _updateState() {
    this.setState({
      table: tableStore.getAll(this.tableId)
    });
  }
  _updateMinRowWidth() {
    actions.updateMinRowWidth(this.tableId, this.props);
  }
  render() {
    if(!this.state.table) {
      return null;
    }
    return (
      <Table
        tableId={this.tableId}
        {...this.props}
        {...this.state.table.toJS()}
      />
    );
  }
}
export default TableContainer;

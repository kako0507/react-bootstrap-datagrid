import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import FaSpinner from 'react-icons/lib/fa/spinner';
import {scrollbarWidth} from '../constants';
import * as actions from '../actions/app';
import appStore from '../stores/app';
import Thead from './TheadContainer';
import Tbody from './TbodyContainer';
import styles from './Table.scss';

class Table extends Component {
  static propTypes = {
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
    updateRowWidth: PropTypes.func,
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
  constructor(props) {
    super(props);
    this._handleDrag = ::this._handleDrag;
    this._setHeaderScroll = ::this._setHeaderScroll;
    this._updateRowWidth = ::this._updateRowWidth;
  }
  _handleDrag(ev) {
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader);
    const dragLeft = ev.pageX - tableHeader.getBoundingClientRect().left;
    if(dragLeft < 30) {
      tableHeader.scrollLeft -= 30;
      const tbody = ReactDOM.findDOMNode(this.refs.tableBody);
      if(tbody) {
        tbody.scrollLeft = tableHeader.scrollLeft;
      }
    }
    else if(dragLeft > tableHeader.offsetWidth - 30) {
      tableHeader.scrollLeft += 30;
      const tbody = ReactDOM.findDOMNode(this.refs.tableBody);
      if(tbody) {
        tbody.scrollLeft = tableHeader.scrollLeft;
      }
    }
  }
  _setHeaderScroll(ev) {
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader);
    tableHeader.scrollLeft = ev.target.scrollLeft;
  }
  _updateRowWidth(hasRightScrollbar) {
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader);
    const currentTableWidth = ReactDOM.findDOMNode(this).offsetWidth;
    this.props.updateRowWidth(
      currentTableWidth,
      hasRightScrollbar
    );
    const tbody = ReactDOM.findDOMNode(this.refs.tableBody);
    if(tbody) {
      tbody.scrollLeft = tableHeader.scrollLeft;
    }
  }
  render() {
    const {
      tableStyles,
      className,
      columnMinWidth,
      flexColumnWidth,
      hasRightScrollbar,
      maxRowWidth,
      minRowWidth,
      updateRowWidth,
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
        className={classNames(
          styles['table'],
          tableStyles.map(style => styles[`table-${style}`]),
          className
        )}
      >
        <Thead
          ref="tableHeader"
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
          onDrag={this._handleDrag}
          onColumnOrderChange={onColumnOrderChange}
          selectedItems={selectedItems}
          selectedBy={selectedBy}
          onSelectionChange={onSelectionChange}
          disableSelection={disableSelection}
          idProperty={idProperty}
        />
        <Tbody
          ref="tableBody"
          tableStyles={tableStyles}
          height={height}
          columnMinWidth={columnMinWidth}
          flexColumnWidth={flexColumnWidth}
          maxRowWidth={maxRowWidth}
          minRowWidth={minRowWidth}
          updateRowWidth={this._updateRowWidth}
          rowHeight={rowHeight}
          hasRightScrollbar={hasRightScrollbar}
          itemPadding={itemPadding}
          setHeaderScroll={this._setHeaderScroll}
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
    this._updateRowWidth = ::this._updateRowWidth;
    this._updateMinRowWidth = ::this._updateMinRowWidth;
  }
  componentDidMount() {
    appStore.addListener('change', this._updateState);
    this._updateMinRowWidth();
  }
  componentWillUmount() {
    appStore.removeListener('change', this._updateState);
  }
  componentWillReceiveProps() {
    this._updateMinRowWidth();
  }
  _updateState() {
    this.setState(appStore.getAll());
  }
  _updateRowWidth(currentTableWidth, hasRightScrollbar) {
    actions.updateRowWidth({
      ...this.props,
      currentTableWidth,
      hasRightScrollbar
    });
  }
  _updateMinRowWidth() {
    actions.updateMinRowWidth(this.props);
  }
  render() {
    return (
      <Table
        {...this.props}
        {...this.state}
        updateRowWidth={this._updateRowWidth}
      />
    );
  }
}
export default TableContainer;

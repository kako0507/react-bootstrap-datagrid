import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import FaSpinner from 'react-icons/lib/fa/spinner';
import {scrollbarWidth} from '../constants';
import Thead from './TheadContainer';
import Tbody from './TbodyContainer';
import styles from './Table.scss';

class Table extends Component {
  static propTypes = {
    // layout
    className: PropTypes.string,
    height: PropTypes.number,
    headerHeight: PropTypes.number,
    maxRowWidth: PropTypes.number,
    minRowWidth: PropTypes.number,
    columnMinWidth: PropTypes.number,
    flexColumnWidth: PropTypes.number,
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
    sortDirections: PropTypes.arrayOf(PropTypes.object),
    multiSort: PropTypes.bool,
    onSortChange: PropTypes.func,
    // column reordering
    onColumnOrderChange: PropTypes.func,
    // select items by checkbox
    selectedItems: React.PropTypes.array,
    selectedBy: PropTypes.arrayOf(
      PropTypes.oneOf(['CHECKBOX', 'ROW'])
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
  _updateRowWidth(maxRowWidth) {
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader);
    this.props.updateRowWidth(maxRowWidth);
    const tbody = ReactDOM.findDOMNode(this.refs.tableBody);
    if(tbody) {
      tbody.scrollLeft = tableHeader.scrollLeft;
    }
  }
  render() {
    const {
      className,
      columnMinWidth,
      flexColumnWidth,
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
          styles['container'],
          className
        )}
      >
        <Thead
          ref="tableHeader"
          columnMinWidth={columnMinWidth}
          flexColumnWidth={flexColumnWidth}
          rowWidth={maxRowWidth + scrollbarWidth}
          minRowWidth={minRowWidth}
          rowHeight={headerHeight || rowHeight}
          showScrollbarField={height > 0}
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
          height={height}
          columnMinWidth={columnMinWidth}
          maxRowWidth={maxRowWidth}
          minRowWidth={minRowWidth}
          updateRowWidth={this._updateRowWidth}
          rowHeight={rowHeight}
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
    columnMinWidth: 100,
    rowHeight: 37,
    itemPadding: 3,
    selectedBy: ['CHECKBOX'],
    idProperty: 'id'
  };
  constructor(props) {
    super(props);
    this._updateRowWidth = ::this._updateRowWidth;
    this._updateMinRowWidth = ::this._updateMinRowWidth;
  }
  componentDidMount() {
    this._updateMinRowWidth();
  }
  componentWillReceiveProps() {
    this._updateMinRowWidth();
  }
  _updateRowWidth(maxRowWidth) {
    const dom = ReactDOM.findDOMNode(this);
    const {
      height,
      columnMinWidth,
      columns,
      onSelectionChange,
      selectedBy
    } = this.props;
    const {minRowWidth} = this.state;
    if(maxRowWidth > dom.offsetWidth) {
      maxRowWidth = minRowWidth;
    }
    else {
      maxRowWidth = dom.offsetWidth - 2;
    }
    if((maxRowWidth && this.state.maxRowWidth !== maxRowWidth)) {
      let flexColumnWidth = maxRowWidth;
      // sub width of scrollbar
      if(onSelectionChange && selectedBy.indexOf('CHECKBOX') > -1) {
        flexColumnWidth = flexColumnWidth - 40;
      }
      let numberOfAutoWidthField = columns.length;
      columns.forEach(column => {
        if(column.width) {
          numberOfAutoWidthField--;
          flexColumnWidth = flexColumnWidth - column.width;
        }
      })
      if(numberOfAutoWidthField) {
        flexColumnWidth = flexColumnWidth / numberOfAutoWidthField;
        if(flexColumnWidth < columnMinWidth) {
          flexColumnWidth = columnMinWidth;
        }
      }
      this.setState({
        maxRowWidth,
        flexColumnWidth
      });
    }
  }
  _updateMinRowWidth() {
    const {
      onSelectionChange,
      selectedBy,
      columns,
      columnMinWidth
    } = this.props;
    let minRowWidth = -2;
    if(onSelectionChange && selectedBy.indexOf('CHECKBOX') > -1) {
      minRowWidth += 40;
    }
    columns.forEach(column => {
      minRowWidth += column.width || columnMinWidth
    });
    this.setState({
      minRowWidth
    });
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

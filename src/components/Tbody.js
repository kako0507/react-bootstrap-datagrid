import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import * as actions from '../actions/table';
import Tr from './Tr';
import styles from './Tbody.scss';
import 'javascript-detect-element-resize';

class Tbody extends Component {
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
    maxRowWidth: PropTypes.number,
    minRowWidth: PropTypes.number,
    rowHeight: PropTypes.number,
    hasRightScrollbar: PropTypes.bool,
    setHeaderScroll: PropTypes.func,
    // main data
    columns: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    itemsIndexRange: PropTypes.arrayOf(PropTypes.number),
    // select items by checkbox
    selectedItems: PropTypes.array,
    selectedBy: PropTypes.arrayOf(PropTypes.string),
    onSelectionChange: PropTypes.func,
    disableSelection: PropTypes.func,
    // lazy rendering
    rowsTop: PropTypes.number,
    itemsToRender: PropTypes.number,
    rowsBottom: PropTypes.number,
    onScroll: PropTypes.func,
    emptyText: PropTypes.string,
    idProperty: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this._updateRowWidth = ::this._updateRowWidth;
  }
  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    dom.addEventListener('scroll', this.props.onScroll);
    addResizeListener(dom.parentNode.parentNode, this._updateRowWidth);
    this._updateRowWidth();
  }
  componentWillUnmount() {
    const dom = ReactDOM.findDOMNode(this);
    dom.removeEventListener('scroll', this.props.onScroll);
    removeResizeListener(dom.parentNode.parentNode, this._updateRowWidth);
  }
  componentDidUpdate() {
    //this._updateRowWidth();
  }
  _updateRowWidth() {
    const {
      height,
    } = this.props;
    const currentTableWidth = document.querySelector(`#table-${this.props.tableId}`).offsetWidth;
    const thead = document.querySelector(`#thead-${this.props.tableId}`);
    const tbody = ReactDOM.findDOMNode(this);
    const tbodyItems = ReactDOM.findDOMNode(this.refs.tbodyItems);
    const hasRightScrollbar = tbodyItems.offsetHeight > height;
    actions.updateRowWidth(
      this.props.tableId,
      {
	...this.props,
	currentTableWidth,
	hasRightScrollbar
      }
    );
    if(tbody) {
      tbody.scrollLeft = thead.scrollLeft;
    }
  }
  _getItemsToRender() {
    const {
      height,
      rowHeight,
      items,
      itemsIndexRange,
      itemPadding,
      rowsTop,
      itemsToRender,
      idProperty
    } = this.props;
    let arrItemsToRender = items;
    let missingNumTop = 0;
    let missingNumBottom = 0;
    if(rowHeight > 0 && height > 0) {
      let start = rowsTop;
      let end = rowsTop + itemsToRender;
      arrItemsToRender = arrItemsToRender.slice(start, end);
      const missingNum = (itemsToRender <= items.length ? itemsToRender: (items.length || 0)) - arrItemsToRender.length;
      if(missingNumTop > missingNum) {
        missingNumTop = missingNum;
      }
      missingNumBottom = missingNum - missingNumTop;
    }
    return {
      arrItemsToRender,
      missingNumTop,
      missingNumBottom
    };
  }
  render() {
    const {
      tableId,
      tableStyles,
      height,
      maxRowWidth,
      minRowWidth,
      rowHeight,
      hasRightScrollbar,
      items,
      selectedItems,
      selectedBy,
      onSelectionChange,
      disableSelection,
      rowsTop,
      rowsBottom,
      emptyText,
      idProperty
    } = this.props;
    const {
      arrItemsToRender,
      missingNumTop,
      missingNumBottom
    } = this._getItemsToRender();
    return (
      <div
	id={`tbody-${tableId}`}
        className={classNames(
          styles['tbody'],
          tableStyles.map(style => styles[`tbody-${style}`]),
          {
            [styles['tbody-scrollbar']]: hasRightScrollbar
          }
        )}
        style={{
          height
        }}
        key="tbody"
      >
        <div
          style={{
            height
          }}
        >
          {!items.length &&
            <div
              style={{
                borderBottom: height && emptyText
                  ? '1px solid #dadada'
                  : undefined,
                flex: 1,
                textAlign: 'center'
              }}
            >
              {emptyText}
            </div>
          }
          {height > 0 && rowHeight > 0 && rowsTop > 0 &&
            <div
              style={{
                height: rowsTop * rowHeight || undefined
              }}
              key="top"
            />
          }
          <div ref="tbodyItems">
            {arrItemsToRender.map((rowItem, index) => (
              <Tr
                {...this.props}
                rowItem={rowItem}
                hasBorderBottom={
                  (
                    missingNumBottom
                 || rowsBottom
                 || items.length < (height / rowHeight)
                  )
               && index === arrItemsToRender.length - 1
                }
                key={rowItem[idProperty]}
              />
            ))}
          </div>
          {height > 0 && rowHeight > 0 && rowsBottom > 0 &&
            <div
              style={{
                height: rowsBottom * rowHeight || undefined
              }}
              key="bottom"
            />
          }
        </div>
      </div>
    );
  }
}

export default Tbody;

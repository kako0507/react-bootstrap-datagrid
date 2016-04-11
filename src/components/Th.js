import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {stopEventPropagation} from '../utils';
import styles from './Thead.scss';

class Th extends Component {
  static propTypes = {
    // layout
    width: PropTypes.number,
    columnMinWidth: PropTypes.number,
    rowHeight: PropTypes.number,
    // column configuration
    columnConfig: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired
    }),
    // sorting
    sort: PropTypes.object,
    sortable: PropTypes.bool,
    // column reordering
    index: PropTypes.number,
    isDragging: PropTypes.bool,
    onColumnOrderChange: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    // select items by checkbox
    selectedItems: PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
  };
  constructor(props) {
    super(props);
    this._handleMouseDown = ::this._handleMouseDown;
    this._handleMouseMove = ::this._handleMouseMove;
    this._handleMouseUp = ::this._handleMouseUp;
  }
  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    dom.addEventListener("mousedown", this._handleMouseDown);
  }
  compoenentWillUnmount() {
    const dom = ReactDOM.findDOMNode(this);
    dom.removeEventListener("mousedown", this._handleMouseDown);
  }
  _handleMouseMove(ev) {
    stopEventPropagation(ev);
    document.body.style.cursor = 'ew-resize';
    this.props.onDrag(ev);
  }
  _handleMouseDown(ev) {
    if(ev.which == 1) {
      stopEventPropagation(ev);
      this.props.onDragStart(ev, this.props.index);
      if(this.props.onColumnOrderChange) {
        window.addEventListener("mousemove", this._handleMouseMove);
      }
      window.addEventListener("mouseup", this._handleMouseUp);
    }
  }
  _handleMouseUp(ev) {
    if(ev.which == 1) {
      stopEventPropagation(ev);
      this.props.onDragEnd(ev, this.props.columnConfig);
      if(this.props.onColumnOrderChange) {
        document.body.style.cursor = 'auto';
        window.removeEventListener("mousemove", this._handleMouseMove);
      }
      window.removeEventListener("mouseup", this._handleMouseUp);
    }
  }
  render() {
    const {
      width,
      columnMinWidth,
      rowHeight,
      columnConfig,
      selectedItems,
      sort,
      sortable,
      onColumnOrderChange,
      isDragging
    } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    if(typeof columnConfig.title !== 'string') {
      return (
        <div
          className={styles['th']}
          style={{
            minWidth: (!width || (columnMinWidth > width) ? columnMinWidth : width) - 1,
            flex: width === undefined ? 1 : undefined,
            opacity
          }}
        >
          <div
            style={{
              width: width === undefined ? undefined : width - 1,
              height: rowHeight,
              padding: 0
            }}
          >
            {columnConfig.title}
          </div>
        </div>
      );
    }
    return (
      <div
        className={classNames(
          styles['th'],
          {
            [styles['reorder-column']]: !!onColumnOrderChange,
            [styles['sortable']]: sortable || sort
          }
        )}
        style={{
          minWidth: (!width || (columnMinWidth > width) ? columnMinWidth : width) - 1,
          flex: width === undefined ? 1 : undefined,
          opacity
        }}
      >
        <div
          title={rowHeight > 0
            ? columnConfig.title
            : undefined
          }
          style={{
            width: width === undefined ? undefined : width - 1,
            height: rowHeight
          }}
        >
          <div
            className={classNames(
              styles['sort-indicator'],
              {
                'fixed-row-height': rowHeight > 0,
                [styles['sort-indicator-asc']]: sort && sort.dir === 'asc',
                [styles['sort-indicator-desc']]: sort && sort.dir === 'desc'
              }
            )}
            style={{
              maxWidth: '100%'
            }}
          >
            <span className="th-text">
              {columnConfig.title}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Th;

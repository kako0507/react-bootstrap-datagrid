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
    /*columnConfig: React.PropTypes.shape({
          name: React.PropTypes.string.isRequired
    }),*/
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
    selectedItems: PropTypes.array,
  };
  constructor(props) {
    super(props);
    this._handleMouseDown = ::this._handleMouseDown;
    this._handleMouseMove = ::this._handleMouseMove;
    this._handleMouseUp = ::this._handleMouseUp;
  }
  _handleMouseMove(ev) {
    stopEventPropagation(ev);
    document.body.style.cursor = 'move';
    const {tableId, actions} = this.props;
    const thead =  document.querySelector(`#thead-${tableId}`);
    const mouseLeft = ev.pageX - thead.getBoundingClientRect().scrollLeft;
    const dragLeft = mouseLeft + thead.scrollLeft;
    actions.setDragInfo(
      tableId,
      'DRAGGING',
      {
        mouseLeft,
        dragLeft
      }
    );
  }
  _handleMouseDown(ev) {
    if(ev.which == 1) {
      stopEventPropagation(ev);
      //this.props.onDragStart(ev, this.props.index);
      const {tableId, actions} = this.props;
      const thead =  document.querySelector(`#thead-${tableId}`);
      actions.setDragInfo(
        tableId,
        'START',
        {
          dragStartIndex: this.props.index,
          dragStartLeft: (
            ev.pageX
          - thead.getBoundingClientRect().left
          + thead.scrollLeft
          )
        }
      );
      if(this.props.onColumnOrderChange) {
        window.addEventListener('mousemove', this._handleMouseMove);
      }
      window.addEventListener('mouseup', this._handleMouseUp);
    }
  }
  _handleMouseUp(ev) {
    if(ev.which == 1) {
      stopEventPropagation(ev);
      //this.props.onDragEnd(ev, this.props.columnConfig);
      if(this.props.onColumnOrderChange) {
        document.body.style.cursor = 'auto';
        window.removeEventListener('mousemove', this._handleMouseMove);
      }
      window.removeEventListener('mouseup', this._handleMouseUp);
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
    const columnTitle = columnConfig.get('title');
    if(typeof columnTitle !== 'string') {
      return (
        <div
          className={classNames(
            styles['th'],
            {
              [styles['dragging']]: isDragging
            }
          )}
          style={{
            width: !width || (columnMinWidth > width) ? columnMinWidth : width,
            height: rowHeight
          }}
        >
          {columnTitle}
        </div>
      );
    }
    return (
      <div
        title={rowHeight > 0
          ? columnTitle
          : undefined
        }
        className={classNames(
          styles['th'],
          {
            [styles['reorder-column']]: !!onColumnOrderChange,
            [styles['dragging']]: isDragging,
            [styles['sortable']]: sortable || sort
          }
        )}
        style={{
          width: !width || (columnMinWidth > width) ? columnMinWidth : width,
          height: rowHeight
        }}
        onMouseDown={this._handleMouseDown}
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
            {columnTitle}
          </span>
        </div>
      </div>
    );
  }
}

export default Th;

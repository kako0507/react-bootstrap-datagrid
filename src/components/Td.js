import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {stopEventPropagation} from '../utils';
import styles from './Td.scss';

function getDescendantByDotNotation(obj, is, value) {
  try {
    if (typeof is == 'string')
      return getDescendantByDotNotation(obj, is.split('.'), value);
    else if (is.length==1 && value!==undefined)
      return obj[is[0]] = value;
    else if (is.length==0)
      return obj;
    else
      return getDescendantByDotNotation(obj[is[0]],is.slice(1), value);
  }
  catch(err) {
    return undefined;
  }
}

class Td extends Component {
  static propTypes = {
    // layout
    width: PropTypes.number,
    columnMinWidth: PropTypes.number,
    rowHeight: PropTypes.number,
    // main data
    columnConfig: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      tipKey: React.PropTypes.string
    }),
    rowItem: PropTypes.object,
    isSelectByClickRow: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this._handleClick = ::this._handleClick;
  }
  componentDidMount() {
    const {rowItem, columnConfig, isSelectByClickRow} = this.props;
    let dom;
    if(rowItem && typeof columnConfig.handleClick === 'function') {
      if(isSelectByClickRow) {
        dom = ReactDOM.findDOMNode(this.refs.click);
      }
      else {
        dom = ReactDOM.findDOMNode(this);
      }
      dom.addEventListener('click', this._handleClick);
    }
  }
  componentWillUnmount() {
    const {rowItem, columnConfig, isSelectByClickRow} = this.props;
    let dom;
    if(rowItem && typeof columnConfig.handleClick === 'function') {
      if(isSelectByClickRow) {
        dom = ReactDOM.findDOMNode(this.refs.click);
      }
      else {
        dom = ReactDOM.findDOMNode(this);
      }
      dom.removeEventListener('click', this._handleClick);
    }
  }
  _handleClick(ev) {
    const {rowItem, columnConfig, isSelectByClickRow} = this.props;
    const value = getDescendantByDotNotation(rowItem, columnConfig.name);
    columnConfig.handleClick(
      value,
      rowItem,
      ev
    );
    if(isSelectByClickRow) {
      stopEventPropagation(ev);
    }
  }
  render() {
    const {
      width,
      columnMinWidth,
      rowHeight,
      columnConfig,
      rowItem,
      isSelectByClickRow
    } = this.props;
    let value;
    let title;
    let cursor;
    if(rowItem) {
      try {
        if(columnConfig.name) {
          value = getDescendantByDotNotation(rowItem, columnConfig.name);
        }
        if(columnConfig.tipKey) {
          title = getDescendantByDotNotation(rowItem, columnConfig.tipKey);
        }
        else if(rowHeight > 0 && typeof value === 'string') {
          title = value;
        }
        try {
          if(
            typeof columnConfig.handleClick === 'function'
         && !columnConfig.disableClick(value, rowItem)
          ) {
            cursor = 'pointer';
          }
        }
        catch(err) {}
        if(columnConfig.render) {
          value = columnConfig.render(value, rowItem);
        }
      }
      catch(err) {}
      if(columnConfig.handleClick && isSelectByClickRow) {
        value = (
          <div
            ref="click"
            style={{
              display: 'inline-block'
            }}
          >
            {value}
          </div>
        );
      }
      if(value === undefined) {
        value = '--';
      }
    }
    return (
      <div
        title={title}
        className={styles['td']}
        style={{
          minWidth: (!width || (columnMinWidth > width) ? columnMinWidth : width) - 1,
          flex: width === undefined ? 1 : undefined,
          cursor
        }}
      >
        <div
          className={classNames({
            [styles['fixed-row-height']]: rowHeight > 0
          })}
          style={{
            width: width === undefined ? undefined : width - 1,
            height: rowHeight > 0
              ? rowHeight - 1
              : undefined,
            padding: `${rowHeight / 2 - 10}px 8px`,
          }}
        >
          {value}
        </div>
      </div>
    );
  }
}

export default Td;

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import {stopEventPropagation} from '../utils';
import styles from './TableCheckBox.scss';

function noop() {}

class TableCheckBox extends Component {
  static defaultProps = {
    selectedItems: []
  };
  static propTypes = {
    rowHeight: PropTypes.number,
    items: PropTypes.array.isRequired,
    rowItem: PropTypes.object,
    selectedItems: PropTypes.oneOfType([
      PropTypes.object,
      // array of ids
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string
        ])
      )
    ]),
    isSelectAll: PropTypes.bool,
    onSelectionChange: PropTypes.func.isRequired,
    disableSelection: PropTypes.func,
    idProperty: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this._handleToggleSelect = ::this._handleToggleSelect;
  }
  componentDidMount() {
    this._update();
  }
  componentDidUpdate() {
    this._update();
  }
  _update() {
    const {
      items,
      isSelectAll,
      idProperty
    } = this.props;
    if(isSelectAll) {
      let {selectedItems} = this.props;
      let checkbox = ReactDOM.findDOMNode(this.refs.checkbox);
      const selectedItemsIsObj = !Array.isArray(selectedItems);
      if(selectedItemsIsObj) {
        selectedItems = _.map(selectedItems, idProperty);
      }
      const count = _.intersection(
        selectedItems,
        items.map(rowItem => rowItem[idProperty])
      ).length;
      checkbox.indeterminate = count && count !== items.length;
      checkbox.checked = count === items.length;
    }
  }
  _handleToggleSelect(ev) {
    const {
      onToggleSelect,
      disableSelection,
      items,
      idProperty
    } = this.props;
    stopEventPropagation(ev);
    if(onToggleSelect) {
      onToggleSelect(ev);
      return;
    }
    let {selectedItems} = this.props;
    const selectedItemsIsObj = !Array.isArray(selectedItems);
    const checkbox = ReactDOM.findDOMNode(this.refs.checkbox);
    if(selectedItemsIsObj) {
      selectedItems = _.map(selectedItems, idProperty);
    }
    if(checkbox.checked || checkbox.indeterminate) {
      selectedItems = [];
    }
    else {
      selectedItems = items.map(rowItem => rowItem[idProperty]);
    }
    if(disableSelection || selectedItemsIsObj) {
      const objItems = _.mapKeys(items, value => value[idProperty]);
      if(disableSelection) {
        selectedItems = selectedItems
          .map(id => objItems[id])
          .filter(rowItem => !disableSelection(rowItem))
          .map(rowItem => rowItem[idProperty])
      }
      if(selectedItemsIsObj) {
        selectedItems = _(selectedItems)
          .mapKeys(value => value)
          .mapValues((value, key) => objItems[key])
          .value();
      }
    }
    this.props.onSelectionChange(selectedItems);
  }
  render() {
    let checked;
    const {
      rowHeight,
      items,
      rowItem,
      selectedItems,
      isSelectAll,
      disableSelection,
      idProperty
    } = this.props;
    try {
      if(rowItem) {
        if(Array.isArray(selectedItems)) {
          // checked = selectedItems.find(id => id == rowItem[idProperty]) !== undefined;
          checked = selectedItems.filter(id => id == rowItem[idProperty]).length;
        }
        else {
          checked = selectedItems[rowItem[idProperty]]
        }
      }
    }
    catch(err) {
    }
    let isDisabled = !isSelectAll && !rowItem;
    if(
      !isDisabled
   && disableSelection
   && rowItem
    ) {
      try {
        isDisabled = disableSelection(rowItem);
      }
      catch(err) {
      }
    }
    return (
      <div
        className={classNames(
          styles['td-checkbox'],
          {
            [styles['disabled']]: isDisabled
          }
        )}
        style={{
          height: rowHeight - 1 || undefined
        }}
        onClick={!isDisabled && this._handleToggleSelect}
      >
        <div className={styles['c-checkbox']}>
          <input
            ref="checkbox"
            type="checkbox"
            checked={checked}
            onChange={noop}
            disabled={isDisabled}
          />
          <span className={styles['c-indicator']}/>
        </div>
      </div>
    );
  }
}

export default TableCheckBox;

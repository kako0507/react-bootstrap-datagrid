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
    selectedItems: PropTypes.array,
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
      const selectedItems = this.props.selectedItems || [];
      let checkbox = ReactDOM.findDOMNode(this.refs.checkbox);
      const count = _.intersection(
        selectedItems.map(rowItem => rowItem[idProperty]),
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
      onToggleSelect();
      return;
    }
    let {selectedItems} = this.props;
    const checkbox = ReactDOM.findDOMNode(this.refs.checkbox);
    if(checkbox.checked || checkbox.indeterminate) {
      selectedItems = [];
    }
    else {
      selectedItems = items;
    }
    if(disableSelection) {
      selectedItems = selectedItems.filter(
        rowItem => !disableSelection(rowItem)
      );
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
        // checked = selectedItems.find(id => id == rowItem[idProperty]) !== undefined;
        checked = selectedItems.filter(
          selectedItem => selectedItem[idProperty] == rowItem[idProperty]
        ).length;
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

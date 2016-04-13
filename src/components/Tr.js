import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import Td from './Td';
import TableCheckBox from './TableCheckBox';
import styles from './Tbody.scss';

class Tr extends Component {
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
    minRowWidth: PropTypes.number,
    rowHeight: PropTypes.number,
    hasBorderBottom: PropTypes.bool,
    // main data
    columns: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    rowItem: PropTypes.object,
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
  constructor(props) {
    super(props);
    this._handleToggleSelect = ::this._handleToggleSelect;
  }
  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
  }
  _getSelectedIds() {
    const {idProperty} = this.props;
    let {selectedItems} = this.props;
    const selectedItemsIsObj = !Array.isArray(selectedItems);
    if(selectedItemsIsObj) {
      selectedItems = _.map(selectedItems, idProperty);
    }
    return {selectedItems, selectedItemsIsObj};
  }
  _rowIsSelected() {
    const {rowItem, idProperty} = this.props;
    if(!rowItem) {
      return false;
    }
    const {selectedItems} = this._getSelectedIds();
    return selectedItems.indexOf(rowItem[idProperty]) > -1;
  }
  _handleToggleSelect(ev) {
    const {
      onSelectionChange,
      disableSelection,
      selectedBy,
      items,
      rowItem,
      idProperty
    } = this.props;
    if(!rowItem || (disableSelection && disableSelection(rowItem))) {
      return;
    }
    let {selectedItems, selectedItemsIsObj} = this._getSelectedIds();
    const arrToggleIds = [rowItem[idProperty]];
    if(selectedItems.indexOf(rowItem[idProperty]) > -1) {
      selectedItems = _.difference(selectedItems, arrToggleIds);
    }
    else {
      selectedItems = _.union(selectedItems, arrToggleIds);
    }
    if(selectedItemsIsObj) {
      const objItems = _.mapKeys(items, value => value[idProperty]);
      selectedItems = _(selectedItems)
        .mapKeys(value => value)
        .mapValues((value, key) => objItems[key])
        .value();
    }
    this.props.onSelectionChange(selectedItems, ev.which);
  }
  render() {
    const {
      tableStyles,
      height,
      columnMinWidth,
      flexColumnWidth,
      minRowWidth,
      rowHeight,
      hasBorderBottom,
      columns,
      items,
      rowItem,
      selectedItems,
      onSelectionChange,
      disableSelection,
      selectedBy,
      idProperty
    } = this.props;
    const isSelectByClickRow = onSelectionChange && selectedBy.indexOf('ROW') > -1;
    return (
      <div
        className={classNames(
          styles['tr'],
          tableStyles.map(style => styles[`tr-${style}`]),
          {
            [styles['row-hover']]: rowItem && isSelectByClickRow,
            [styles['row-seleced']]: isSelectByClickRow && this._rowIsSelected()
          }
        )}
        style={{
          minWidth: !isNaN(minRowWidth) && minRowWidth,
          height: rowHeight > 0
            ? rowHeight - 1
            : undefined,
          borderBottom: hasBorderBottom
            ? '1px solid #dadada'
            : undefined
        }}
        onMouseDown={isSelectByClickRow && this._handleToggleSelect}
      >
        {onSelectionChange && selectedBy.indexOf('CHECKBOX') > -1 &&
          <TableCheckBox
            rowHeight={rowHeight}
            items={items}
            rowItem={rowItem}
            selectedItems={selectedItems}
            onSelectionChange={onSelectionChange}
            onToggleSelect={this._handleToggleSelect}
            disableSelection={disableSelection}
            idProperty={idProperty}
          />
        }
        {columns.map(columnConfig => (
          <Td
            width={columnConfig.width || flexColumnWidth}
            columnMinWidth={columnMinWidth}
            rowHeight={rowHeight}
            columnConfig={columnConfig}
            rowItem={rowItem}
            isSelectByClickRow={isSelectByClickRow}
            key={columnConfig.name}
          />
        ))}
      </div>
    );
  }
}

export default Tr;

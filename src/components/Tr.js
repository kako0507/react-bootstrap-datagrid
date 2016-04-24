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
    selectedItems: PropTypes.array,
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
  _rowIsSelected() {
    const {
      rowItem,
      selectedItems,
      idProperty
    } = this.props;
    if(!rowItem || !selectedItems || !selectedItems.length) {
      return false;
    }
    return selectedItems
      .map(selectedItem => selectedItem[idProperty])
      .indexOf(rowItem[idProperty]) > -1;
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
    const isSelectByClickRow = onSelectionChange && selectedBy.indexOf('row') > -1;
    if(!rowItem || (!ev && isSelectByClickRow) || (disableSelection && disableSelection(rowItem))) {
      return;
    }
    let selectedItems = [...(this.props.selectedItems || [])];
    const index = selectedItems
      ? selectedItems
          .map(selectedItem => selectedItem[idProperty])
          .indexOf(rowItem[idProperty])
      : -1;
    if(index > -1) {
      selectedItems.splice(index, 1);
    }
    else {
      selectedItems.push(rowItem);
    }
    onSelectionChange(selectedItems, ev);
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
    const isSelectByClickRow = onSelectionChange && selectedBy.indexOf('row') > -1;
    return (
      <div
        className={classNames(
          styles['tr'],
          tableStyles.map(style => styles[`tr-${style}`]),
          {
            [styles['tr-selected']]: isSelectByClickRow && this._rowIsSelected()
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
        {onSelectionChange && selectedBy.indexOf('checkbox') > -1 &&
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

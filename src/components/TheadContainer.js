import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import * as actions from '../actions/thead';
import theadStore from '../stores/thead';
import Thead from './Thead';

class TheadContainer extends Component {
  state = {};
  constructor(props) {
    super(props);
    this._updateState = ::this._updateState;
    this._handleSortChange = ::this._handleSortChange;
  }
  componentDidMount() {
    const {tableId, columns} = this.props;
    actions.setTempColumns(tableId, columns);
    theadStore.addListener('change', this._updateState);
  }
  componentWillUmount() {
    theadStore.removeListener('change', this._updateState);
  }
  componentWillReceiveProps(nextProps) {
    const {tableId, columns} = nextProps;
    actions.setTempColumns(tableId, columns);
  }
  _updateState() {
    this.setState({
      thead: theadStore.getAll(this.props.tableId)
    });
  }
  _handleSortChange(name) {
    if(!this.props.onSortChange) {
      return;
    }
    let {
      sortStatus,
      sortFields,
      sortDirections,
      multiSort
    } = this.props;
    if(sortFields && sortFields.indexOf(name) === -1) {
      return;
    }
    let sortDirection;
    if(sortDirections) {
      sortDirection = sortDirections[name];
    }
    if(!sortDirection) {
      sortDirection = 'asc'
    }
    if(multiSort) {
      let sortItem = sortStatus && sortStatus
        //.find(sortItem => sortItem.name === name);
        .filter(sortItem => sortItem.name === name)[0];
      if(sortItem) {
        const sortStatusName = sortStatus.map(sort => sort.name);
        const sortItemIndex = sortStatusName.indexOf(sortItem.name);
        if(
            sortDirection
         && sortItem.dir
         && sortItem.dir !== sortDirection
        ) {
          sortStatus = List
            .of(...sortStatus)
            .delete(sortItemIndex)
            .toJS();
        }
        else {
          sortStatus = List
            .of(...sortStatus)
            .update(
              sortItemIndex,
              () => ({
                ...sortItem,
                dir: sortItem.dir === 'asc' ? 'desc' : 'asc'
              })
            )
            .toJS();
        }
      }
      else {
        if(!sortStatus) {
          sortStatus = [];
        }
        sortItem = {name, dir: sortDirection};
        sortStatus = List
          .of(...sortStatus)
          .push(sortItem)
          .toJS();
      }
    }
    else {
      if(sortStatus && sortStatus.name === name) {
        sortStatus = {
          name,
          dir: sortStatus.dir === 'asc' ? 'desc' : 'asc'
        };
      }
      else {
        sortStatus = {
          name,
          dir: sortDirection
        };
      }
    }
    this.props.onSortChange(sortStatus);
  }
  _handleDrag(ev, mouseDownColumnConfig) {/*
    const {tableId} = this.props;
    const {data} = this.state;
    const dragStartIndex = data.get('dragStartIndex');
    const oldDragEndIndex = data.get('dragEndIndex');
    const thead =  document.querySelector(`#thead-${tableId}`);
    const dragLeft = (
      ev.pageX
      - thead.getBoundingClientRect().left
      + thead.scrollLeft
    );
    const dragDistance = dragLeft - data.get('dragStartLeft');
    const dragDistanceVertical = ev.pageY - data.get('dragStartTop');
    const isDragging = (
      data.get('isDragging')
   || Math.abs(dragDistance) > 10
   || Math.abs(dragDistanceVertical) > 10
    );
    if(this.props.onColumnOrderChange) {
      const {flexColumnWidth, columns} = this.props;
      let widthSum = 0;
      let dragEndIndex = dragStartIndex;
      if(dragDistance > 0) {
        for(let i = dragStartIndex; i < (columns.length - 1); i++) {
          const columnWidth = (columns[i + 1].width || flexColumnWidth);
          if(dragDistance > widthSum + columnWidth / 2) {
            dragEndIndex = i + 1;
          }
          else {
            break;
          }
          widthSum += columnWidth;
        }
      }
      else if(dragDistance < 0) {
        for(let i = dragStartIndex; i > 0; i--) {
          const columnWidth = (columns[i - 1].width || flexColumnWidth);
          if(Math.abs(dragDistance) > (widthSum + columnWidth / 2)) {
            dragEndIndex = i - 1;
          }
          else {
            break;
          }
          widthSum += columnWidth;
        }
      }
      if(
        dragEndIndex !== oldDragEndIndex
     || mouseDownColumnConfig
      ) {
        const tempColumn = columns[dragStartIndex];
        const tempColumns = List
          .of(...columns)
          .delete(dragStartIndex)
          .insert(dragEndIndex, tempColumn);
        if(
          dragEndIndex !== oldDragEndIndex
       && !mouseDownColumnConfig
        ) {
          this.setState(({data}) => ({
            data: data
              .update('tempColumns', () => tempColumns)
              .update('dragEndIndex', () => dragEndIndex)
              .update('isDragging', () => isDragging)
          }));
        }
        else {
          if(dragStartIndex !== dragEndIndex) {
            this.props.onColumnOrderChange(tempColumns.toJS());
          }
          else if(!isDragging && typeof mouseDownColumnConfig.title === 'string') {
            this._handleSortChange(mouseDownColumnConfig.name);
          }
          this.setState(({data}) => ({
            data: data
              .update('dragStartIndex', () => undefined)
              .update('dragEndIndex', () => undefined)
              .update('isDragging', () => undefined)
          }));
        }
      }
      if(!mouseDownColumnConfig) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = setTimeout(
          this._handleDrag.bind(this, ev),
          100
        );
        const tbody = document.querySelector(`#tbody-${tableId}`);
        const dragLeft = ev.pageX - thead.getBoundingClientRect().left;
        if(dragLeft < 30) {
          thead.scrollLeft -= 30;
          if(tbody) {
            tbody.scrollLeft = thead.scrollLeft;
          }
        }
        else if(dragLeft > thead.offsetWidth - 30) {
          thead.scrollLeft += 30;
          if(tbody) {
            tbody.scrollLeft = thead.scrollLeft;
          }
        }
      }
    }
    else if(mouseDownColumnConfig && !isDragging) {
      this._handleSortChange(mouseDownColumnConfig.name);
    }
  */}
  _handleDragEnd(ev, mouseDownColumnConfig) {/*
    this._handleDrag(ev, mouseDownColumnConfig);
    clearTimeout(this.dragTimeout);
  */}
  render() {
    const {tableId, onSortChange} = this.props;
    const {thead} = this.state;
    if(!thead) {
      return <div id={`thead-${tableId}`}/>;
    }
    return (
      <Thead
        {...this.props}
        onSortChange={onSortChange && this._handleSortChange}
        tempColumns={thead.get('tempColumns')}
        dragStartIndex={thead.get('dragStartIndex')}
        isDragging={thead.get('isDragging')}
        actions={actions}
      />
    );
  }
}

export default TheadContainer;

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Map, List} from 'immutable';
import Thead from './Thead';

class TheadContainer extends Component {
  state = {
    data: Map({
      tempColumns: List()
    })
  };
  constructor(props) {
    super(props);
    this._handleSortChange = ::this._handleSortChange;
    this._handleDragStart = ::this._handleDragStart;
    this._handleDrag = ::this._handleDrag;
    this._handleDragEnd = ::this._handleDragEnd;
  }
  componentDidMount() {
    this.setState(({data}) => ({
      data: data.update(
        'tempColumns',
        () => List.of(...this.props.columns)
      )
    }));
  }
  componentWillReceiveProps(nextProps) {
    this.setState(({data}) => ({
      data: data.update(
        'tempColumns',
        () => List.of(...nextProps.columns)
      )
    }));
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
  _handleDragStart(ev, dragStartIndex) {
    const dom =  ReactDOM.findDOMNode(this);
    this.setState(({data}) => ({
      data: data
        .update('dragStartIndex', () => dragStartIndex)
        .update('dragStartLeft', () => (
          ev.pageX
        - dom.getBoundingClientRect().left
        + dom.scrollLeft
        ))
    }));
  }
  _handleDrag(ev, mouseDownColumnConfig) {
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
  }
  _handleDragEnd(ev, mouseDownColumnConfig) {
    this._handleDrag(ev, mouseDownColumnConfig);
    clearTimeout(this.dragTimeout);
  }
  render() {
    const {onSortChange} = this.props;
    const {data} = this.state;
    return (
      <Thead
        {...this.props}
        onSortChange={onSortChange && this._handleSortChange}
        tempColumns={data.get('tempColumns')}
        dragStartIndex={data.get('dragStartIndex')}
        isDragging={data.get('isDragging')}
        onDragStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onDragEnd={this._handleDragEnd}
      />
    );
  }
}

export default TheadContainer;

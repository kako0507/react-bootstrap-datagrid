import {Map, List} from 'immutable';
import dispatcher from '../dispatcher';
import actionConstants from '../constants/action';
import {EventEmitter} from 'events';

let data = Map();

const store = new EventEmitter();
store.getAll = tableId => data.get(tableId);
store.dispatchToken = dispatcher.register(action => {
  switch(action.type) {
    case actionConstants.CREATE_TABLE: {
      data = data.update(
        action.tableId,
        () => Map()
      )
      store.emit('change');
      break;
    }
    case actionConstants.SET_TEMP_COLUMNS: {
      data = data.mergeIn([action.tableId], action.data);
      store.emit('change');
      break;
    }
    case actionConstants.SET_DRAG_INFO: {
      if(action.status == 'START') {
        data = data.mergeIn([action.tableId], action.data);
      }
      else {
        const dragStartIndex = data.getIn([action.tableId, 'dragStartIndex']);
        const oldDragEndIndex = data.getIn([action.tableId, 'dragEndIndex']);
        const dragDistance = action.data.dragLeft - data.getIn([action.tableId, 'dragStartLeft']);
        const dragDistanceVertical = ev.pageY - data.getIn([action.tableId, 'dragStartTop']);
        const isDragging = (
          data.getIn([action.tableId, 'isDragging'])
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
            const tbody = document.querySelector(`#tbody-${action.tableId}`);
            if(action.data.mouseLeft < 30) {
              thead.scrollLeft -= 30;
              if(tbody) {
                tbody.scrollLeft = thead.scrollLeft;
              }
            }
            else if(action.data.mouseLeft > thead.offsetWidth - 30) {
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
      store.emit('change');
      break;
    }
    default:
  }
})

export default store;

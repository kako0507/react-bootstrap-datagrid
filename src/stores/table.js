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
      data = data.mergeIn(
        action.tableId,
        {
	  minRowWidth: 100,
	  maxRowWidth: 100,
	  flexColumnWidth: 100,
	  hasRightScrollbar: false
        }
      )
      store.emit('change');
      break;
    }
    case actionConstants.SET_ROW_WIDTH: {
      const {
        currentTableWidth,
        hasRightScrollbar,
        height,
        onSelectionChange,
        selectedBy,
        columns,
        columnMinWidth
      } = action.data;
      const minRowWidth = data.get('minRowWidth');
      let maxRowWidth;
      if(currentTableWidth < minRowWidth) {
        maxRowWidth = minRowWidth;
      }
      else {
        maxRowWidth = currentTableWidth;
      }
      if(
        (maxRowWidth && data.get('maxRowWidth') !== maxRowWidth)
     || hasRightScrollbar !== data.get('hasRightScrollbar')
      ) {
        let flexColumnWidth = maxRowWidth;
        // sub width of scrollbar
        if(height > 0 && hasRightScrollbar) {
          flexColumnWidth -= 17;
        }
        if(onSelectionChange && selectedBy.indexOf('checkbox') > -1) {
          flexColumnWidth -= 40;
        }
        let numberOfAutoWidthField = columns.length;
        columns.forEach(column => {
          if(column.width) {
            numberOfAutoWidthField--;
            flexColumnWidth = flexColumnWidth - column.width;
          }
        });
        if(numberOfAutoWidthField) {
          flexColumnWidth = flexColumnWidth / numberOfAutoWidthField;
          if(flexColumnWidth < columnMinWidth) {
            flexColumnWidth = columnMinWidth;
          }
        }
        data = data.mergeIn(
	  [action.tableId],
	  {
	    maxRowWidth,
	    flexColumnWidth,
	    hasRightScrollbar
          }
        );
        store.emit('change');
      }
      break;
    }
    case actionConstants.SET_MIN_ROW_WIDTH: {
      data = data.mergeIn(
        [action.tableId],
        action.data
      );
      store.emit('change');
      break;
    }
    default:
  }
})

export default store;

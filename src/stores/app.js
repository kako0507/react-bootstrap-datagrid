import dispatcher from '../dispatcher';
import actionConstants from '../constants/action';
import * as actions from '../actions/app';
import {EventEmitter} from 'events';

let data = {
  minRowWidth: 100,
  maxRowWidth: 100,
  flexColumnWidth: 100,
  hasRightScrollbar: false
};

const store = new EventEmitter();
store.getAll  = () => data;
store.dispatchToken = dispatcher.register(action => {
  switch(action.type) {
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
      let maxRowWidth;
      if(currentTableWidth < data.minRowWidth) {
        maxRowWidth = data.minRowWidth;
      }
      else {
        maxRowWidth = currentTableWidth;
      }
      if(
        (maxRowWidth && data.maxRowWidth !== maxRowWidth)
     || hasRightScrollbar !== data.hasRightScrollbar
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
        data = {
          ...data,
          maxRowWidth,
          flexColumnWidth,
          hasRightScrollbar
        };
        store.emit('change');
      }
      break;
    }
    case actionConstants.SET_MIN_ROW_WIDTH: {
      data = {
        ...data,
        ...action.data
      };
      store.emit('change');
      break;
    }
    default:
  }
})

export default store;

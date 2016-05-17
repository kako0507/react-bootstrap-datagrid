import {dispatch} from '../dispatcher';
import actionConstants from '../constants/action';

//const dispatch = dispatcher.dispatch.bind(dispatcher);

export function setTempColumns(tableId, tempColumns) {
  dispatch({
    type: actionConstants.SET_TEMP_COLUMNS,
    tableId,
    data: {
      tempColumns
    }
  });
}

export function setDragInfo(tableId, status, data) {
  dispatch({
    type: actionConstants.SET_DRAG_INFO,
    tableId,
    data
  });
}

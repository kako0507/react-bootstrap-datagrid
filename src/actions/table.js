import {dispatch} from '../dispatcher';
import actionConstants from '../constants/action';

//const dispatch = dispatcher.dispatch.bind(dispatcher);

export function createTable(tableId) {
  dispatch({
    type: actionConstants.CREATE_TABLE,
    tableId
  });
}

export function updateRowWidth(tableId, data) {
  dispatch({
    type: actionConstants.SET_ROW_WIDTH,
    tableId,
    data
  });
}

export function updateMinRowWidth(
  tableId,
  {
    onSelectionChange,
    selectedBy,
    columns,
    columnMinWidth
  }
) {
  let minRowWidth = -2;
  if(onSelectionChange && selectedBy.indexOf('checkbox') > -1) {
    minRowWidth += 40;
  }
  columns.forEach(column => {
    minRowWidth += column.width || columnMinWidth
  });
  dispatch({
    type: actionConstants.SET_MIN_ROW_WIDTH,
    tableId,
    data: {
      minRowWidth
    }
  });
}

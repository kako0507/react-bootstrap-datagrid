import dispatcher from '../dispatcher';
import actionConstants from '../constants/action';

const dispatch = dispatcher.dispatch.bind(dispatcher);

export function setTempColumns(tableId, tempColumns) {
  dispatch({
    type: actionConstants.SET_TEMP_COLUMNS,
    tableId,
    data: {
      tempColumns
    }
  });
}

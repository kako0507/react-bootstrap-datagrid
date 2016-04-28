import {Map, List} from 'immutable';
import dispatcher from '../dispatcher';
import actionConstants from '../constants/action';
import {EventEmitter} from 'events';

let data = Map();

const store = new EventEmitter();
store.getAll = tableId => data.get(tableId);
store.dispatchToken = dispatcher.register(action => {
  switch(action.type) {
    case actionConstants.SET_TEMP_COLUMNS: {
      data = data.mergeIn(data.tableId, action.data);
      store.emit('change');
      break;
    }
    default:
  }
})

export default store;

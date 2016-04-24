import dispatcher from '../dispatcher';
import actionConstants from '../constants/action';
import * as actions from '../actions/app';
import {EventEmitter} from 'events';

let data = {};
const store = {
  ...new EventEmitter(),
  getAll: () => data,
};

store.dispatchToken = dispatcher.register({action} => {
  switch(action.type) {
    case actionConstants.TODO_CREATE:
      data = {
        ...data,
      };
      Store.emit(actionConstants.CHANGE_EVENT);
      break;
    default:
  }
})

export default store;

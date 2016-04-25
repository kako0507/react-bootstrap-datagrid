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
store.dispatchToken = dispatcher.register(({action}) => {
  switch(action.type) {
    case actionConstants.TODO_CREATE:
      data = {
        ...data,
      };
      Store.emit('change');
      break;
    default:
  }
})

export default store;

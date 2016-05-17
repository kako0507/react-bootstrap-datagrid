import {Dispatcher} from 'flux';
import async from 'async';

const dispatcher = new Dispatcher();

const queue = async.queue((action, callback) => {
  dispatcher.dispatch.apply(dispatcher, [action]);
  callback();
}, 1);

export function dispatch(action) {
  queue.push(action);
}

export default dispatcher;

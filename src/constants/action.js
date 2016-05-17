import _ from 'lodash';

const action = [
  'CREATE_TABLE',
  'SET_ROW_WIDTH',
  'SET_MIN_ROW_WIDTH',
  'SET_TEMP_COLUMNS',
  'SET_DRAG_INFO'
];

export default _(action)
  .mapKeys(value => value)
  .value();

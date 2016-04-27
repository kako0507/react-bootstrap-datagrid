import _ from 'lodash';

const action = [
  'SET_ROW_WIDTH',
  'SET_MIN_ROW_WIDTH',
];

export default _(action)
  .mapKeys(value => value)
  .value();

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Table from 'react-bootstrap-datagrid';
import faker from 'faker';

const columns = [
  {
    title: 'firstName',
    name: 'firstName',
  },
  {
    title: 'lastName',
    name: 'lastName',
  },
  {
    title: 'email',
    name: 'email',
  },
  {
    title: 'company',
    name: 'company',
  }
];
const items = _
  .range(1000)
  .map(i => ({
    id: i,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    company: faker.company.companyName()
  }));

class Simple extends Component {
  state = {
    items,
    multiSort: false
  };
  constructor(props) {
    super(props);
    function setSortMode(multiSort) {
      this.setState({
        multiSort,
        sortStatus: undefined
      });
    }
    this._handleSortChange = ::this._handleSortChange;
    this._setSortModeSingle = setSortMode.bind(this, false);
    this._setSortModeMultiple = setSortMode.bind(this, true);
  }
  _handleSortChange(sortStatus) {
    let items;
    if(this.state.multiSort) {
      items = _.orderBy(
        this.state.items,
        sortStatus.map(sort => (
          rowItem => rowItem[sort.name]
        )),
        sortStatus.map(sort => sort.dir)
      );
    }
    else {
      items = _.orderBy(
        this.state.items,
        [rowItem => rowItem[sortStatus.name]],
        [sortStatus.dir]
      );
    }
    this.setState({
      items,
      sortStatus
    });
  }
  render() {
    const {
      multiSort,
      items,
      sortStatus
    } = this.state;
    return (
      <div>
        <div
          style={{
            width: 130,
            display: 'inline-block',
            verticalAlign: 'top'
          }}
        >
          <div>
            <label>
              <input
                type="radio"
                style={{pointerEvent: 'none'}}
                checked={!multiSort}
                onChange={this._setSortModeSingle}
              />
              single field
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                style={{pointerEvent: 'none'}}
                checked={multiSort}
                onChange={this._setSortModeMultiple}
              />
              multiple field
            </label>
          </div>
        </div>
        <div
          style={{
            width: 'calc(100% - 130px)',
            display: 'inline-block',
            verticalAlign: 'top'
          }}
        >
          <Table
            height={500}
            columns={columns}
            items={items}
            sortStatus={sortStatus}
            multiSort={multiSort}
            sortDirections={{firstName: 'desc'}}
            onSortChange={this._handleSortChange}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Simple/>,
  document.getElementById('main')
);

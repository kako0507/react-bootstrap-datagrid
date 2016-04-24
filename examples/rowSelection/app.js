import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Table from 'react-bootstrap-datagrid';
import {Set} from 'immutable';
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
  .range(10)
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
    selectedBy: Set.of('checkbox')
  };
  constructor(props) {
    super(props);
    const setSelectedBy = style => {
      let selectedBy;
      if(this.state.selectedBy.toJS().indexOf(style) > -1) {
        selectedBy = this.state.selectedBy.delete(style);
      }
      else {
        selectedBy = this.state.selectedBy.add(style);
      }
      this.setState({
        selectedBy
      });
    };
    this._setSelectedByCheckbox = setSelectedBy.bind(this, 'checkbox');
    this._setSelectedByRow = setSelectedBy.bind(this, 'row');
    this._handleSelectionChange = ::this._handleSelectionChange;
  }
  _handleSelectionChange(selectedItems) {
    this.setState({
      selectedItems
    });
  }
  render() {
    const selectedBy = this.state.selectedBy.toJS();
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
            <input
              type="checkbox"
              checked={selectedBy.indexOf('checkbox') > -1}
              onChange={this._setSelectedByCheckbox}
            />
            checkbox
          </div>
          <div>
            <input
              type="checkbox"
              checked={selectedBy.indexOf('row') > -1}
              onChange={this._setSelectedByRow}
            />
            row
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
            selectedBy={selectedBy}
            selectedItems={this.state.selectedItems}
            onSelectionChange={this._handleSelectionChange}
            columns={columns}
            items={items}
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

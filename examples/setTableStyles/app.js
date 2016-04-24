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
    tableStyles: Set()
  };
  constructor(props) {
    super(props);
    const setTableStyles = style => {
      let tableStyles;
      if(this.state.tableStyles.toJS().indexOf(style) > -1) {
        tableStyles = this.state.tableStyles.delete(style);
      }
      else {
        tableStyles = this.state.tableStyles.add(style);
      }
      this.setState({
        tableStyles
      });
    };
    this._setTableStylesBordered = setTableStyles.bind(this, 'bordered');
    this._setTableStylesInverse = setTableStyles.bind(this, 'inverse');
    this._setTableStylesStriped = setTableStyles.bind(this, 'striped');
    this._setTableStylesHover = setTableStyles.bind(this, 'hover');
  }
  render() {
    const tableStyles = this.state.tableStyles.toJS();
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
            <label className="c-input c-checkbox">
              <input
                type="checkbox"
                checked={tableStyles.indexOf('bordered') > -1}
                onChange={this._setTableStylesBordered}
              />
              <span className="c-indicator"/>
              bordered
            </label>
          </div>
          <div>
            <label className="c-input c-checkbox">
              <input
                type="checkbox"
                checked={tableStyles.indexOf('inverse') > -1}
                onChange={this._setTableStylesInverse}
              />
              <span className="c-indicator"/>
              inverse
            </label>
          </div>
          <div>
            <label className="c-input c-checkbox">
              <input
                type="checkbox"
                checked={tableStyles.indexOf('striped') > -1}
                onChange={this._setTableStylesStriped}
              />
              <span className="c-indicator"/>
              striped
            </label>
          </div>
          <div>
            <label className="c-input c-checkbox">
              <input
                type="checkbox"
                checked={tableStyles.indexOf('hover') > -1}
                onChange={this._setTableStylesHover}
              />
              <span className="c-indicator"/>
              hover
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
            tableStyles={tableStyles}
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

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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
  state={
    columns,
  };
  constructor(props) {
    super(props);
    this._handleColumnOrderChange = ::this._handleColumnOrderChange;
  }
  _handleColumnOrderChange(columns) {
    console.log(columns);
    this.setState({
      columns
    });
  }
  render() {
    return (
      <Table
        tableStyles={[
          'bordered',
          'inverse',
          'striped',
          'hover',
        ]}
        columns={this.state.columns}
        items={items}
        onColumnOrderChange={this._handleColumnOrderChange}
      />
    );
  }
}

ReactDOM.render(
  <Simple/>,
  document.getElementById('main')
);

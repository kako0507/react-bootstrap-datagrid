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
  .range(20)
  .map(i => ({
    id: i,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    company: faker.company.companyName()
  }));

class Simple extends Component {
  render() {
    return (
      <Table
        columns={columns}
        items={items}
        height={500}
      />
    );
  }
}

ReactDOM.render(
  <Simple/>,
  document.getElementById('main')
);

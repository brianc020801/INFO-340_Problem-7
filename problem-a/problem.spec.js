const raf = require('raf') //fix raf warning, redux!

import React from 'react';
//updated to use RTL, but still checking internals (doing it badly)
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Console errors cause test failures
console['error'] = (errorMessage) => { 
  if(typeof errorMessage === "string"){ //why is sometimes not a string?
    expect(errorMessage.split('\n', 1)[0]).toBe("") 
  }
}

//solution classes
//import {App, SenatorTable, TableHeader, SenatorRow} from  './src/App';
//import * as solution from  './src/App';

//test data
const TEST_SENATORS = [
  {id: 1, name: 'Test Sen 1', state: 'AB',  party: 'Dem', phone: '123-456-789', twitter: 'test1'},
  {id: 2, name: 'Test Sen 2', state: 'CD', party: 'Rep', phone: '234-567-980', twitter: 'test2'},
  {id: 3, name: 'Test Sen 3', state: 'EF', party: 'Ind', phone: '555-555-5555', twitter: 'test3'}
];
const TEST_HEADINGS = ['Col A','Col B','Col C'];

/* Begin the tests */

describe('The Senator listing app', () => { 
  beforeEach(() => {
    jest.resetModules();
  });
  
  describe('the implemented `App` component', () => {
    it('renders without crashing', () => {
      const { App } = require('./src/components/App');
      render(<App senatorsList={[]} />);
    });
  
    it('has the `container` CSS class', () => {
      const { App } = require('./src/components/App');
      const { container } = render(<App senatorsList={[]} />);
      expect(container.firstChild.classList.contains('container')).toBe(true);
    })

    it('contains a heading', () => {
      const { App } = require('./src/components/App');
      const { container } = render(<App senatorsList={[]} />);
      let heading = container.querySelector('h1');
      expect(heading.textContent).toBe('US Senators (Jan 2022)');
    })

    it('renders a SenatorTable', () => {
      //mock the module
      jest.doMock('./src/components/SenatorTable', () => ({
        __esModule: true,
        SenatorTable: jest.fn(() => <div data-testid="SenatorTable" />)
      }))

      const { App } = require('./src/components/App');
      render(<App senatorsList={[]} />);
      expect(screen.getByTestId('SenatorTable')).toBeInTheDocument(); //contains a SenatorTable

      jest.dontMock('./src/components/SenatorTable'); //"unmock"
    });
  })

  describe('implements a `SenatorTable` component', () => {
    it('renders a table', () => {
      const { SenatorTable } = require('./src/components/SenatorTable');
      const {container} = render(<SenatorTable senatorsList={TEST_SENATORS}/>);
      expect(container.querySelector('table')).not.toBeNull(); //contains a table
    })

    it('has appropriate classes for styling', () => {
      const { SenatorTable } = require('./src/components/SenatorTable');
      const {container} = render(<SenatorTable senatorsList={TEST_SENATORS}/>);
      const tableClassList = container.querySelector('table').classList;
      expect(tableClassList.contains("table")).toBe(true);
      expect(tableClassList.contains("table-bordered")).toBe(true);
    })

    it('renders a TableHeader', () => {
      //mock the module
      jest.doMock('./src/components/TableHeader', () => ({
        __esModule: true,
        TableHeader: jest.fn(() => <thead data-testid="TableHeader" />)
      }))

      const { SenatorTable } = require('./src/components/SenatorTable');
      render(<SenatorTable senatorsList={TEST_SENATORS}/>);
      expect(screen.getByTestId('TableHeader')).toBeInTheDocument(); //contains a TableHeader

      jest.dontMock('./src/components/TableHeader'); //"unmock"
    });

    it('renders rows for Senators', () => {
      //mock the module
      jest.doMock('./src/components/SenatorRow', () => ({
        __esModule: true,
        SenatorRow: jest.fn(() => <tr data-testid="SenatorRow" />)
      }))

      const { SenatorTable } = require('./src/components/SenatorTable');
      render(<SenatorTable senatorsList={TEST_SENATORS}/>);
      expect(screen.getAllByTestId('SenatorRow').length).toBe(TEST_SENATORS.length); //includes SenatorRows (correct number)

      jest.dontMock('./src/components/SenatorRow'); //"unmock"
    });
  })

  describe('implements a `TableHeader` component', () => {
    it('renders a table header element', () => {
      const { TableHeader } = require('./src/components/TableHeader');
      const {container} = render(<TableHeader columnNames={TEST_HEADINGS} />, {
        container: document.body.appendChild(document.createElement('table'))
      });

      expect(container.querySelector('thead')).not.toBeNull();
      expect(container.querySelectorAll('thead > tr').length).toBe(1);
      expect(container.querySelectorAll('tr > th').length).toBe(TEST_HEADINGS.length);
    })

    it('renders header cells based on the props', () => {
      const { TableHeader } = require('./src/components/TableHeader');
      const {container} = render(<TableHeader columnNames={TEST_HEADINGS} />, {
        container: document.body.appendChild(document.createElement('table'))
      });

      let headings = container.querySelectorAll('th');
      for(let i=0; i<TEST_HEADINGS.length; i++){
        expect(headings[i].textContent).toEqual(TEST_HEADINGS[i])
      }
    })
  })

  describe('implements a `SenatorRow` component', () => { 
    it('renders a table row', () => {
      const { SenatorRow } = require('./src/components/SenatorRow');
      const tbody = document.createElement('tbody')
      document.body.appendChild(document.createElement('table')).appendChild(tbody);
      const {container} = render(<SenatorRow senatorData={TEST_SENATORS[0]} />, {
        container: tbody
      });

      expect(container.querySelectorAll('tr').length).toBe(1);
      expect(container.querySelectorAll('tr > td').length).toBe(4); //has the 4 required cells
    })

    it('renders the correct cells based on the props', () => {
      const { SenatorRow } = require('./src/components/SenatorRow');
      const tbody = document.createElement('tbody')
      document.body.appendChild(document.createElement('table')).appendChild(tbody);
      const {container} = render(<SenatorRow senatorData={TEST_SENATORS[0]} />, {
        container: tbody
      });

      const cells = container.querySelectorAll('td');
      expect(cells[0].textContent).toEqual('Test Sen 1');
      expect(cells[1].textContent).toEqual('D - AB');
      expect(cells[2].innerHTML).toEqual('<a href="tel:123-456-789">123-456-789</a>'); //just hard-code it for now
      expect(cells[3].innerHTML).toEqual('<a href="https://twitter.com/test1">@test1</a>');
    })
  })
})

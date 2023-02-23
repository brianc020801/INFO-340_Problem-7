import React from 'react'; //import React library
import { TableHeader } from './TableHeader.js';
import { SenatorRow } from './SenatorRow.js';

const EXAMPLE_SENATORS = [
  { id: 'C000127', name: 'Maria Cantwell', state: 'WA', party: 'Democrat', phone: '202-224-3441', twitter: 'SenatorCantwell' },
  { id: 'M001111', name: 'Patty Murray', state: 'WA', party: 'Democrat', phone: '202-224-2621', twitter: 'PattyMurray' }
];

export function SenatorTable(prop){
  const columnNames = ['Name', 'State', 'Phone', 'Twitter'];
  const senatorArray = prop.senatorsList.map((senator) => {
    return <SenatorRow senatorData={senator} key={senator.id.toString()}/>
  })
  return(
    <table className="table table-bordered">
      <TableHeader columnNames={columnNames} />
      <tbody>
        {senatorArray}
      </tbody>
    </table>
  )
}
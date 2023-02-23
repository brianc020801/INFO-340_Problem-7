import React from 'react'; //import React library
import { SenatorTable } from './SenatorTable.js';

export function App(prop){
    return (
        <div className='container'>
            <h1>US Senators (Jan 2022)</h1>
            <SenatorTable senatorsList = {prop.senatorsList}/>
        </div>
    )
}
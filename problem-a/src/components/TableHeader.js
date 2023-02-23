import React from 'react'; //import React library

export function TableHeader(prop){
    const thArray = prop.columnNames.map(name => <th key={name}>{name}</th>);
    return(
        <thead>
            <tr>
                {thArray}
            </tr>
        </thead>
    )
}
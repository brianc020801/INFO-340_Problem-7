import React, { useState } from 'react'; //import React Component

import _ from 'lodash'; //import external library!

export default function GameDataTable(props) {

  const [sortByCriteria, setSortByCriteria] = useState(null);
  const [isAscending, setIsAscending] = useState(null);

  function handleClick(event){
    const currentTarget = event.currentTarget.name;
    setSortByCriteria(currentTarget);
    if(currentTarget !== sortByCriteria){
      setIsAscending(1);
    }else{
      if(isAscending === 1){
        setIsAscending(2);
      }else{
        setIsAscending(null);
        setSortByCriteria(null);
      }
    }
  }
  let sorttedData = _.sortBy(props.data, sortByCriteria);
  if(sortByCriteria != null && isAscending === 2){
    sorttedData = _.reverse(sorttedData);
  }
  //convert data into rows
  const rows = sorttedData.map((match) => {
    return <GameDataRow key={match.year} game={match} />
  });

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>
              Year
              <SortButton name="year" onClick={handleClick} active = {sortByCriteria === "year" ? true : false} ascending = {sortByCriteria === "year" && isAscending === 1 ? true : false}/>
            </th>
            <th className="text-end">
              Winner
              <SortButton name="winner" onClick={handleClick} active = {sortByCriteria === "winner" ? true : false} ascending = {sortByCriteria === "winner" && isAscending === 1 ? true : false}/>
            </th>
            <th className="text-center">
              Score
              <SortButton name="score" onClick={handleClick} active = {sortByCriteria === "score" ? true : false} ascending = {sortByCriteria === "score" && isAscending === 1 ? true : false}/>
            </th>
            <th>
              Runner-Up
              <SortButton name="runner_up" onClick={handleClick} active = {sortByCriteria === "runner_up" ? true : false} ascending = {sortByCriteria === "runner_up" && isAscending === 1 ? true : false}/>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
}

//Component for managing display logic of sort button
//Props: 
//  `active` [boolean] if icon should be highlighted,
//  `ascending` [boolean] if icon should be in ascending order (flipped)
//  `onClick` [function] click handler (passthrough)
function SortButton(props) {
  let iconClasses = ""
  if (props.active) { iconClasses += ` active` }
  if (props.ascending) { iconClasses += ` flip` };

  return (
    <button className="btn btn-sm btn-sort" name={props.name} onClick={props.onClick}>
      <span className={"material-icons" + iconClasses} aria-label={`sort by ${props.name}`}>sort</span>
    </button>
  );
}

function GameDataRow({ game }) { //game = props.game
  return (
    <tr>
      <td>{game.year}</td>
      <td className="text-end">{game.winner} {game.winner_flag}</td>
      <td className="text-center">{game.score}</td>
      <td>{game.runner_up_flag}&nbsp;&nbsp;{game.runner_up}</td>
    </tr>
  );
}

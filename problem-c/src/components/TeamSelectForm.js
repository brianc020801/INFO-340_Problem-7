import React, { useState } from 'react'; //import React Component

export default function TeamSelectForm(props) {

  const [team, setTeam] = useState('');
  const [includeRu, setIncludRu] = useState(false);

  function selectCallback(event){
    setTeam(event.target.value);
  }

  function inputCallback(event){
    setIncludRu(event.target.checked);
  }

  const optionElems = props.teamOptions.map((teamName) => {
    return <option key={teamName} value={teamName}>{teamName}</option>
  })

  return (
    <div className="row align-items-center mb-3">
      <div className="col-auto">
        <select id="teamSelect" className="form-select" value={team} onChange={selectCallback}>
          <option value="">Show all teams</option>
          {optionElems}
        </select>
      </div>
      <div className="col-auto">
        <div className="form-check">
          <input id="runnerupCheckbox" type="checkbox" className="form-check-input" checked={includeRu} onChange={inputCallback}/>
          <label htmlFor="runnerupCheckbox" className="form-check-label">Include runner-up</label>
        </div>
      </div>
      <div className="col-auto">
        <button id="submitButton" type="submit" className="btn btn-warning" onClick={()=>props.applyFilterCallback(team, includeRu)}>Apply Filter</button>
      </div>
    </div>
  );
}
import React, { useState } from 'react'; //import React Component

export default function TeamSelectForm(props) {

  //Your work goes here

  const optionElems = props.teamOptions.map((teamName) => {
    return <option key={teamName} value={teamName}>{teamName}</option>
  })

  return (
    <div className="row align-items-center mb-3">
      <div className="col-auto">
        <select id="teamSelect" className="form-select">
          <option value="">Show all teams</option>
          {optionElems}
        </select>
      </div>
      <div className="col-auto">
        <div className="form-check">
          <input id="runnerupCheckbox" type="checkbox" className="form-check-input" />
          <label htmlFor="runnerupCheckbox" className="form-check-label">Include runner-up</label>
        </div>
      </div>
      <div className="col-auto">
        <button id="submitButton" type="submit" className="btn btn-warning">Apply Filter</button>
      </div>
    </div>
  );
}
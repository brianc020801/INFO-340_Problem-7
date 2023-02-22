const raf = require('raf') //fix raf warning, redux!

import React from 'react';
//updated to use RTL, but still checking internals (doing it badly)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

let mockActualReact;
jest.doMock('react', () => {
  if (!mockActualReact) {
    mockActualReact = jest.requireActual('react');
  }
  return mockActualReact;
});

// Console errors cause test failures
console['error'] = (errorMessage) => { 
  if(typeof errorMessage === "string"){ //why is sometimes not a string?
    expect(errorMessage.split('\n', 1)[0]).toBe("") 
  }
}

//solution classes
// import App from  './src/components/App';
// import GameDataTable from './src/components/GameDataTable';
// import TeamSelectForm from './src/components/TeamSelectForm';

//test data
const TEST_GAMES = [
  {
    "year": 2010,
    "winner": "Team B",
    "winner_flag":"🙂",
    "score": "3-0",
    "runner_up": "Team C",
    "runner_up_flag":"🙂"
  },
  {
    "year": 2014,
    "winner": "Team D",
    "winner_flag":"🙂",
    "score": "2-0",
    "runner_up": "Team A",
    "runner_up_flag":"🙂"
  },
  {
    "year": 2018,
    "winner": "Team A",
    "winner_flag":"🙂",
    "score": "1-0",
    "runner_up": "Team B",
    "runner_up_flag":"🙂"
  }
];

//D winner: 1, D runner-up: 0
//B winner: 1, B runner-up: 2
//A winner: 1, A runner-up: 2
//C winner: 0, C runner-up: 1

const INDEX_OF_YEAR = {} //for reverse lookup of order
INDEX_OF_YEAR[TEST_GAMES[0].year] = 0
INDEX_OF_YEAR[TEST_GAMES[1].year] = 1
INDEX_OF_YEAR[TEST_GAMES[2].year] = 2

const TEST_TEAMS = ['Team A', 'Team B', 'Team C', 'Team D'];


/* Begin the tests */

describe('The game browser app', () => {

  it('renders without crashing (all components)', () => {
    const App = require('./src/components/App').default;
    const { container } = render(<App gameData={TEST_GAMES}/>);
  });

  describe('The GameDataTable Component', () => {

    //determine current order of the rows, for simple comparison
    function getCurrentRowOrder(container) {
      const tableRows = container.querySelectorAll('tbody tr');
      const firstRowCells = tableRows[0].querySelectorAll('td');
      const secondRowCells = tableRows[1].querySelectorAll('td');
      const thirdRowCells = tableRows[2].querySelectorAll('td');

      return [
        INDEX_OF_YEAR[firstRowCells[0].textContent],
        INDEX_OF_YEAR[secondRowCells[0].textContent],
        INDEX_OF_YEAR[thirdRowCells[0].textContent]
      ]
    }

    //test the content of each row to confirm they match the given order
    function testRowContentForOrder(orderArray, container) {
      const tableRows = container.querySelectorAll('tbody tr');
      expect(tableRows.length).toBe(3); //shows all 3 testing rows
      const firstRowCells = tableRows[0].querySelectorAll('td');
      const secondRowCells = tableRows[1].querySelectorAll('td');
      const thirdRowCells = tableRows[2].querySelectorAll('td');
      expect(firstRowCells[0].textContent).toEqual(TEST_GAMES[orderArray[0]].year+"");
      expect(firstRowCells[1].textContent).toMatch(TEST_GAMES[orderArray[0]].winner);
      expect(firstRowCells[3].textContent).toMatch(TEST_GAMES[orderArray[0]].runner_up);
      expect(secondRowCells[0].textContent).toEqual(TEST_GAMES[orderArray[1]].year+"");
      expect(secondRowCells[1].textContent).toMatch(TEST_GAMES[orderArray[1]].winner);
      expect(secondRowCells[3].textContent).toMatch(TEST_GAMES[orderArray[1]].runner_up);
      expect(thirdRowCells[0].textContent).toEqual(TEST_GAMES[orderArray[2]].year+"");
      expect(thirdRowCells[1].textContent).toMatch(TEST_GAMES[orderArray[2]].winner);
      expect(thirdRowCells[3].textContent).toMatch(TEST_GAMES[orderArray[2]].runner_up);      
    }

    it('displayes initial games', () => {
      //check initial rows
      const GameDataTable = require('./src/components/GameDataTable').default;
      const { container } = render(<GameDataTable data={TEST_GAMES}/>);
  
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //expect in original order
      testRowContentForOrder([0,1,2], container);
    })

    it('sorts columns on button click', async () => {
      //re-render, then check each row's order for each button
      const GameDataTable = require('./src/components/GameDataTable').default;
      const { container } = render(<GameDataTable data={TEST_GAMES}/>);

      //click winner button
      const winnerButton = document.querySelector('button[name="winner"]')
      await userEvent.click(winnerButton); //click the second card
      expect(getCurrentRowOrder(container)).toEqual([2,0,1]); //should be sorted by winner
      testRowContentForOrder([2,0,1], container);

      //click score button
      const scoreButton = container.querySelector('button[name="score"]')
      await userEvent.click(scoreButton);
      expect(getCurrentRowOrder(container)).toEqual([2,1,0]); //should be sorted by score
      testRowContentForOrder([2,1,0], container);

      //click runner-up button
      const runnerUpButton = container.querySelector('button[name="runner_up"]')
      await userEvent.click(runnerUpButton);
      expect(getCurrentRowOrder(container)).toEqual([1,2,0]); //should be sorted by runner-up
      testRowContentForOrder([1,2,0], container);

      //click year button
      const yearButton = container.querySelector('button[name="year"]')
      await userEvent.click(yearButton);
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //should be sorted by year
      testRowContentForOrder([0,1,2], container);
    })

    it('sorts columns descending on subsequent clicks', async () => {
      //re-render, check order, click, repeat
      const GameDataTable = require('./src/components/GameDataTable').default;
      const { container } = render(<GameDataTable data={TEST_GAMES}/>);

      //test winner button
      const winnerButton = container.querySelector('button[name="winner"]')
      await userEvent.click(winnerButton);
      expect(getCurrentRowOrder(container)).toEqual([2,0,1]); //1st: should be sorted by winner (descending)
      await userEvent.click(winnerButton);
      expect(getCurrentRowOrder(container)).toEqual([1,0,2]); //2nd: should be sorted by winner (ascending)
      await userEvent.click(winnerButton);
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //3rd: should be unsorted

      //test score button
      const scoreButton = container.querySelector('button[name="score"]')
      await userEvent.click(scoreButton);
      expect(getCurrentRowOrder(container)).toEqual([2,1,0]); //1st: should be sorted by score (descending)
      await userEvent.click(scoreButton);
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //2nd: should be sorted by score (ascending)
      await userEvent.click(scoreButton);
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //3rd: should be unsorted

      //click runner-up button
      const runnerUpButton = container.querySelector('button[name="runner_up"]')
      await userEvent.click(runnerUpButton);
      expect(getCurrentRowOrder(container)).toEqual([1,2,0]); //1st: should be sorted by runner-up (descending)
      await userEvent.click(runnerUpButton);
      expect(getCurrentRowOrder(container)).toEqual([0,2,1]); //2nd: should be sorted by runner-up (ascending)
      await userEvent.click(runnerUpButton);
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //3rd: should be unsorted


      //click year button
      const yearButton = container.querySelector('button[name="year"]')
      await userEvent.click(yearButton);
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //1st: should be sorted by year (descending)
      await userEvent.click(yearButton);
      expect(getCurrentRowOrder(container)).toEqual([2,1,0]); //2nd: should be sorted by year (ascending)
      await userEvent.click(yearButton);
      expect(getCurrentRowOrder(container)).toEqual([0,1,2]); //3rd: should be unsorted
    })

    async function testButtonAppearance(buttonName, container) {
      const button = container.querySelector(`button[name="${buttonName}"]`)
      await userEvent.click(button); //first click
      expect(container.querySelectorAll('.active').length).toBe(1); //only one .active element
      expect(container.querySelectorAll('.flip').length).toBe(1); //only one .flip element
      expect(container.querySelectorAll('.active.flip').length).toBe(1); //only one .active.flip element
      expect(container.querySelector('.active.flip').parentNode.name).toBe(buttonName); //correct button

      await userEvent.click(button); //second click
      expect(container.querySelectorAll('.active').length).toBe(1); //only one .active element
      expect(container.querySelectorAll('.flip').length).toBe(0); //nothing flipped
      expect(container.querySelector('.active').parentNode.name).toBe(buttonName); //correct button

      await userEvent.click(button); //third click
      expect(container.querySelectorAll('.active').length).toBe(0); //nothing active
      expect(container.querySelectorAll('.flip').length).toBe(0); //nothing flipped
    }


    it('button appearance changes based on sorting', async () => {
      //re-render, click, test button appearance (class)
      const GameDataTable = require('./src/components/GameDataTable').default;
      const { container } = render(<GameDataTable data={TEST_GAMES}/>);

      expect(container.querySelectorAll('.active').length).toBe(0); //has no active elements initially
      expect(container.querySelectorAll('.flip').length).toBe(0); //has no active elements initially

      //test year button
      await testButtonAppearance("year", container);

      //test winner button
      await testButtonAppearance("winner", container);

      //test score button
      await testButtonAppearance("score", container);

      //test runner_up button
      await testButtonAppearance("runner_up", container);
    })
  })

  describe('The TeamSelectForm Component', () => {
    it('changing inputs changes values', async () => {
      const TeamSelectForm = require('./src/components/TeamSelectForm').default;
      const { container } = render(<TeamSelectForm teamOptions={TEST_TEAMS}/>);

      const selectElem =  container.querySelector('select');
      expect(selectElem.value).toBe(""); //initially nothing selected

      //try changing <select>
      await userEvent.selectOptions(selectElem, TEST_TEAMS[1]); //pick a team
      //selectElem.simulate('change', {target:{value: TEST_TEAMS[1]}}); //pick a team

      expect(selectElem.value).toBe(TEST_TEAMS[1]); //correct team selected

      //try changing checkbox
      const checkboxElem = container.querySelector('#runnerupCheckbox');
      expect(checkboxElem.checked).toBe(false); //initially not checked
      await userEvent.click(checkboxElem);
      //checkboxElem.simulate('change', {target: {checked: true}});
      expect(checkboxElem.checked).toBe(true);
    })

    it('selecting a team filters for that team on submission', async () => {
      const App = require('./src/components/App').default;
      const { container } = render(<App gameData={TEST_GAMES}/>);

      expect(container.querySelectorAll('tbody tr').length).toBe(3); //shows all 3 rows to start

      const selectElem =  container.querySelector('#teamSelect');
      const checkboxElem = container.querySelector('#runnerupCheckbox');
      const submitButton = container.querySelector('#submitButton')

      //select filtering
      await userEvent.selectOptions(selectElem, TEST_TEAMS[0]); //Team A
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(1); //now shows 1 row (game #2)
      let cells = container.querySelectorAll('tbody tr td');
      expect(cells[0].textContent).toEqual(TEST_GAMES[2].year+"")
      expect(cells[1].textContent).toMatch(TEST_GAMES[2].winner)
      
      await userEvent.selectOptions(selectElem, TEST_TEAMS[1]); //Team B
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(1); //still shows 1 row (game #0)
      cells = container.querySelectorAll('tbody tr td');
      expect(cells[0].textContent).toEqual(TEST_GAMES[0].year+"")
      expect(cells[1].textContent).toMatch(TEST_GAMES[0].winner)

      //select no team (show all rows)
      await userEvent.selectOptions(selectElem, ""); //no team
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(3); //shows 3 rows
      await userEvent.click(checkboxElem); //checkbox
      expect(checkboxElem.checked).toBe(true); //(confirm is now selected)
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(3); //shows 3 rows
    })

    it('can include runners-up when filtering', async () => {
      const App = require('./src/components/App').default;
      const { container } = render(<App gameData={TEST_GAMES}/>);

      const selectElem =  container.querySelector('#teamSelect');
      const checkboxElem = container.querySelector('#runnerupCheckbox');
      const submitButton = container.querySelector('#submitButton')

      //runner-up
      await userEvent.selectOptions(selectElem, TEST_TEAMS[1]); //Team B
      await userEvent.click(checkboxElem); //checkbox
      expect(checkboxElem.checked).toBe(true); //(confirm is now selected)
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(2); //shows 2 rows (games 0 % 2)
      let rows = container.querySelectorAll('tbody tr');
      let firstRowCells = rows[0].querySelectorAll('td');
      expect(firstRowCells[0].textContent).toEqual(TEST_GAMES[0].year+"")
      expect(firstRowCells[1].textContent).toMatch(TEST_GAMES[0].winner)
      let secondRowCells = rows[1].querySelectorAll('td');
      expect(secondRowCells[0].textContent).toEqual(TEST_GAMES[2].year+"")
      expect(secondRowCells[1].textContent).toMatch(TEST_GAMES[2].winner)

      //change team with same runner up
      await userEvent.selectOptions(selectElem, TEST_TEAMS[2]); //Team C
      expect(checkboxElem.checked).toBe(true); //(confirm still selected)
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(1); //shows 1 row (game 0)
      let cells = container.querySelectorAll('tbody tr td');
      expect(cells[0].textContent).toEqual(TEST_GAMES[0].year+"")
      expect(cells[1].textContent).toMatch(TEST_GAMES[0].winner)

      //change runner up with same team
      await userEvent.click(checkboxElem); //uncheck checkbox
      expect(checkboxElem.checked).toBe(false); //(confirm is now NOT selected)
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(0); //shows 0 rows

      //check runner up not exclusive
      await userEvent.selectOptions(selectElem, TEST_TEAMS[3]); //Team D
      await userEvent.click(checkboxElem); //checkbox
      expect(checkboxElem.checked).toBe(true); //(confirm is now selected)
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(1); //shows 1 row (game 1)
      cells = container.querySelectorAll('tbody tr td');
      expect(cells[0].textContent).toEqual(TEST_GAMES[1].year+"")
      expect(cells[1].textContent).toMatch(TEST_GAMES[1].winner)

      //check when no team selected
      await userEvent.selectOptions(selectElem, "");
      expect(checkboxElem.checked).toBe(true); //(confirm still selected)
      await userEvent.click(submitButton); //submit
      expect(container.querySelectorAll('tbody tr').length).toBe(3); //shows 3 rows
    })
  })
})

const raf = require('raf') //fix raf warning, redux!

import React from 'react';
//updated to use RTL, but still checking internals (doing it badly)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Console errors cause test failures
console['error'] = (errorMessage) => { 
  if(typeof errorMessage === "string"){ //why is sometimes not a string?
    expect(errorMessage.split('\n', 1)[0]).toBe("") 
  }
}

//solution classes
// import App from  './src/components/App';


let mockActualReact;
jest.doMock('react', () => {
  if (!mockActualReact) {
    mockActualReact = jest.requireActual('react');
  }
  return mockActualReact;
});

//test data
const TEST_PETS = [
  {"name":"Pet A", "sex":"Male", "breed":"Breed A", "img":"imgA"},
  {"name":"Pet B", "sex":"Male", "breed":"Breed B", "img":"imgB"},
  {"name":"Pet C", "sex":"Male", "breed":"Breed A", "img":"imgC"},
];

/* Begin the tests */

describe('The pet adoption app', () => { 
  beforeEach(() => {
    // jest.resetModules();
  });

  it('renders without crashing', () => {
    const App = require('./src/components/App').default;
    const { container } = render(<App pets={TEST_PETS} />);
  });

  it('renders the App page structure', () => {
    //do a lot of work to keep modules isolated for mocking...
    jest.isolateModules(() => {
      jest.doMock('./src/components/Navigation', () => ({
        __esModule: true,
        AboutNav: jest.fn(() => <div data-testid="AboutNav" />),
        BreedNav: jest.fn(() => <div data-testid="BreedNav" />),
      }))
      jest.doMock('./src/components/PetList', () => ({
        __esModule: true,
        default: jest.fn(() => <div data-testid="PetList" />)
      }))

      //confirm component structure (around mocks)
      const PetList = require('./src/components/PetList').default
      const {AboutNav, BreedNav} = require('./src/components/Navigation')
      expect(AboutNav).toBeDefined(); //AboutNav should be a *named* export
      expect(BreedNav).toBeDefined(); //BreedNav should be a *named* export
      expect(PetList).toBeDefined(); //PetList needs to be a *default* export

      const App = require('./src/components/App').default;
      const { container } = render(<App pets={TEST_PETS} />);

      //header
      expect(container.querySelectorAll('.jumbotron.jumbotron-fluid').length).toBe(1);
      expect(container.querySelector('h1').textContent).toEqual("Adopt a Pet");

      //main (includes columns)
      expect(container.querySelectorAll('.col-3').length).toBe(1);
      expect(container.querySelectorAll('.col-9').length).toBe(1);

      //footer
      expect(container.querySelector('footer').textContent).toEqual("Images from Seattle Humane Society");

      //includes subcomponents, but not their elements
      expect(screen.getByTestId('AboutNav')).toBeInTheDocument(); //contains an AboutNav      
      expect(screen.getByTestId('BreedNav')).toBeInTheDocument(); //contains an BreedNav      
      expect(screen.getByTestId('PetList')).toBeInTheDocument(); //contains an PetList
      expect(container.querySelector('nav')).toBe(null); //no navs in the App return
      expect(container.querySelector('h2')).toBe(null); //no h2s in the App
      expect(container.querySelector('.card')).toBe(null); //no cards in the App

      jest.dontMock('./src/components/Navigation'); //"unmock"
      jest.dontMock('./src/components/PetList'); //"unmock"
    })
  });


  it('renders the AboutNav component', () => {
    jest.dontMock('./src/components/Navigation'); //"unmock" just in case?
    const { AboutNav } = require('./src/components/Navigation');
    const { container } = render(<AboutNav />);
    expect(container.querySelector('h2').textContent).toEqual("About");
    expect(container.querySelectorAll('a').length).toBe(5); //includes all the links
  });

  it('renders the BreedNav component', () => {
    jest.dontMock('./src/components/Navigation'); //"unmock" just in case?
    const testingBreeds = ['Breed A', 'Breed B'];
    const { BreedNav } = require('./src/components/Navigation');
    const { container } = render(<BreedNav breeds={['Breed A', 'Breed B']} />);
    expect(container.querySelector('h2').textContent).toEqual("Pick a Breed");
    const links = container.querySelectorAll('a');
    expect(links.length).toBe(testingBreeds.length); //includes the two links
    for(let i=0; i<links.length; i++){
      expect(links[i].textContent).toEqual(testingBreeds[i]);      
    }
  })

  it('passes BreedNav correct breeds', () => {
    const App = require('./src/components/App').default;
    const { container } = render(<App pets={TEST_PETS} />);

    const breedNavLinks = container.querySelectorAll('#breedLinks a');
    expect(breedNavLinks.length).toBe(2); //shows only 2 links in the #breedLinks
    expect(breedNavLinks[0].textContent).toEqual("Breed A"); //check first text
    expect(breedNavLinks[1].textContent).toEqual("Breed B"); //check second text
  })

  it('renders the PetList component with PetCards', () => {
    jest.dontMock('./src/components/PetList'); //"unmock" just in case?
    
    const PetList = require('./src/components/PetList').default; //now render for real!
    const { container } = render(<PetList pets={TEST_PETS} />);

    expect(container.querySelector('h2').textContent).toEqual('Dogs for Adoption'); //check heading

    expect(container.querySelectorAll('.card').length).toBe(3); //has 3 cards

    const cards = container.querySelectorAll('.card')
    for(let i=0; i<cards.length; i++){
      const pet = TEST_PETS[i];
      const img = cards[i].querySelector('img');
      expect(img.src).toMatch(new RegExp('^[^\/].*'+pet.img)); //relative path to img
      expect(img.alt).toEqual(pet.name);
      const cardTitle = cards[i].querySelector('.card-title');
      expect(cardTitle.textContent.trim()).toEqual(pet.name)
      const cardText = cards[i].querySelector('.card-text');
      expect(cardText.textContent.trim()).toEqual(`${pet.sex} ${pet.breed}`);
    }
  })

  it('cards change displayed adoption status when clicked', async () => {
    const App = require('./src/components/App').default;
    const { container } = render(<App pets={TEST_PETS} />);

    let card0 = container.querySelectorAll('.card')[0];
    let card1 = container.querySelectorAll('.card')[1];
    let card2 = container.querySelectorAll('.card')[2];

    expect(card0.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[0].name); //not adopted
    expect(card1.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[1].name); //not adopted
    expect(card2.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[2].name); //not adopted

    await userEvent.click(card1); //click the second card

    expect(card0.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[0].name); //still not adopted
    expect(card1.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[1].name+' (Adopted)'); //now adopted
    expect(card2.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[2].name); //still not adopted

    await userEvent.click(card1); //click the second card again
    expect(card1.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[1].name+' (Adopted)'); //still adopted

    await userEvent.click(card2); //click the third card

    expect(card0.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[0].name); //still not adopted
    expect(card1.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[1].name+' (Adopted)'); //now adopted
    expect(card2.querySelector('.card-title').textContent.trim()).toEqual(TEST_PETS[2].name+' (Adopted)'); //now adopted
  })
})

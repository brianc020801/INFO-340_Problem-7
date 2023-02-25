import React from 'react';
import { useState } from 'react';
import { AboutNav } from './Navigation.js';
import { BreedNav } from './Navigation.js';
import PetList from './PetList.js';

function App(props) {
  const [pets, setPets] = useState(props.pets)
  function adoptPet(petName){
    let updated = pets.map((pet) => {
      if (pet.name === petName || pet.adopted){
        pet.adopted = true;
      }else{
        pet.adopted = false;
      }
      return pet;
    })
    setPets(updated);
  }
  const breedsList = [...new Set(props.pets.map(pet => pet.breed))];
  return (
      <><header className="jumbotron jumbotron-fluid py-4">
      <div className="container">
        <h1>Adopt a Pet</h1>
      </div>
    </header><main className="container">
        <div className="row">
          <div id="navs" className="col-3">
            <BreedNav breeds={breedsList} />
            <AboutNav />
          </div>

          <div id="petList" className="col-9">
            <PetList pets={props.pets} adoptCallback={adoptPet}/>
          </div>
        </div>
      </main><footer className="container">
        <small>Images from <a href="http://www.seattlehumane.org/adoption/dogs">Seattle Humane Society</a></small>
      </footer></>
  );
}

export default App;

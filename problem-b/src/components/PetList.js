import React from 'react';

function PetCard(props){
    const name = props.petData.name;
    const breed = props.petData.breed;
    const sex = props.petData.sex;
    const img = props.petData.img;
    const adopted = props.petData.adopted;
    return(
        <div className="card" onClick={()=> props.adoptCallback(name)}>
            <img className="card-img-top" src={img} alt={name} />
            <div className="card-body">
                <h3 className="card-title">{name} {adopted ? '(Adopted)' : ''}</h3>
                <p className="card-text">{sex} {breed}</p>
            </div>
        </div>
    )
}

export function PetList(props){
    const petCardArray = props.pets.map((pet) => {
        return <PetCard petData={pet} adoptCallback={props.adoptCallback} key={pet.name}/>
    })
    return(
        <div className='card-deck'>
            {petCardArray}
        </div>
    )
}
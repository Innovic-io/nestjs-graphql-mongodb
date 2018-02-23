# nestjs-graphql-mongodb

GraphQL starter based on MongoDB and NestJS

##Examples

###Owner examples
####Create Owner
```
mutation {
  createOwner(first_name: "Boris",
  last_name: "Yurinov") {
    first_name
    last_name
    email
  }
}
```
####Update Owner by his ID 
```
mutation {
  updateOwner(_id:"{{ownerID}}",
    first_name: "Boris",
    last_name: "Yurinov",
    email: "email@domain.com"
  ) {
    first_name
    last_name
    email
  }
}
```
####Get all Owners
```
{
  getOwners {
    first_name
    last_name
    mobile
    email
    pets {
      name
      age
    }
  }
}
```
####Get owner by his ID
```
{
  getOwnerById(_id: "{{ownerID}}") {
    first_name
    last_name
    mobile
    email
    pets {
      name
      age
    }
  }
}
```
####Delete owner by his ID
```
mutation {
  deleteOwner(_id:"{{ownerID}}") {
    first_name
    last_name
    email
  }
}
```

###Pet examples
####Create Pet
```
mutation {
  createPet(owner:"{{ownerID}}",
  name: "Silvester",
  species: { speciesName: "siamese cat",
    speciesFamily: "cat",
    speciesType:MAMMAL
  },
  age: 2) {
    first_name
    last_name
    email
    pets {
      name
      species {
        speciesName
        speciesType
      }
      age
    }
}
```
####Update pet by ID
```
mutation {
  updatePet(_id: "{{petId}}", 
  age: 3,
  name: "Henry") {
    first_name
    last_name
    pets {
      name
      species {
        speciesName
      }
    }
  }
}
```
####Get pet by ID
```
{
  getPetById(_id: "{{petID}}") { 
    name 
    age
    species {
      speciesFamily
      speciesType
    }
  }
}
```
####Delete pet by ID
```
mutation {
  deletePet(_id: "{{petId}}") {
    name
    species {
      speciesName
    }
  }
}
```

###Fragment example
```
fragment OwnerInfo on Owner {
  first_name
  last_name
  mobile
  email
}
fragment speciesInfo on PetSpecies {
  speciesType
  speciesFamily
  speciesName
}
fragment petsInfo on Pet {
  name
  age
  species { 
    ...speciesInfo
  }
}
{
  getOwners {
    ...OwnerInfo
    pets {
      ...petsInfo 
    }
  } 
}
```

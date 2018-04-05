# nestjs-graphql-mongodb

GraphQL starter based on MongoDB and NestJS

##Examples

###Owner examples
####Create Owner
```graphql
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
```graphql
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
```graphql
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
```graphql
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
```graphql
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
```graphql
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
```graphql
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
```graphql
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
```graphql
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
```graphql
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

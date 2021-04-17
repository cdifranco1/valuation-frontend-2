const { MongoClient } = require('mongodb');

// turn this into an environment variable
const uri = "mongodb+srv://cdifranco:UgAcIpsunOwgSbbl@cluster0.udlzk.mongodb.net/valuation?retryWrites=true&w=majority";

class Person {
  constructor(name) {
    this.name = name
  }

  hello() {
    console.log(`Hello ${this.name}`)
  }
}

const createStore = () => {
  const client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err, mongoClient) => {
    console.log(err)
  });


  return client;
}

module.exports = createStore;
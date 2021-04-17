const { MongoDataSource } = require('apollo-datasource-mongodb')

const DCF_COLLECTION = 'DCF';

class DCFStore extends MongoDataSource {
  constructor( store ) {
    super(store)
    this.store = store
  }

  mockFindOne(id) {
    const mockDCF = {
    }

    return mockDCF
  }

  async insertOne( dcfInput ) {

    try {
      const { insertedId } = await this.store.insertOne( dcfInput )

      return await this.findOneById(insertedId);

    } catch(error) {
      
      console.log(error)
      return;
    }
  }
}




module.exports = DCFStore;
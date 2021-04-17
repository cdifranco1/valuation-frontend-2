
const { buildDCF } = require("./services/DCF")
const { GraphQLScalarType, Kind } = require('graphql');
// dummy dcf data

// const dateScalar = new GraphQLScalarType({
//   name: 'Date',
//   description: 'Date custom scalar type',
//   serialize(value) {
//     return new Date(value);
//   },
//   parseValue(value) {
//     return value.getTime();
//   }
// });

module.exports = {
  Query: {
    dcf: (_, { id }, { dataSources }) => {
      return dataSources.dcfAPI.mockFindOne(id);
    },
  },
  Mutation: {
    createDCF: async (_,  { dcfData }, { dataSources }) => {      

      const newDcf = buildDCF(dcfData);
      // console.log(newDcf)

      const savedRecord = await dataSources.DCFStore.insertOne(newDcf);
      
      savedRecord.id = savedRecord._id;

      return savedRecord;
    },
  }
}


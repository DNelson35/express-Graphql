const graphql = require('graphql')
let fetch;
import('node-fetch').then(module => {
 fetch = module.default;
});

const{
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} = graphql

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: {type: GraphQLString },
        firstName: {type: GraphQLString },
        age: {type: GraphQLInt },
    }
})


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return fetch(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.json())
                .then(user => {
                    console.log(user)
                    return user
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
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
    GraphQLList
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return fetch(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(resp => resp.json())
                .then(users => {
                    console.log(users)
                    return users
                })
            }
        }
    })
})


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ( {
        id: {type: GraphQLString },
        firstName: {type: GraphQLString },
        age: {type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return fetch( `http://localhost:3000/companies/${parentValue.companyId}`)
                .then(resp => resp.json())
                .then(company => {
                    console.log(company.id)
                    return company
                })
            }
        }
    })
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
        },

        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return fetch(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.json())
                .then(comp => {
                    console.log(comp)
                    return comp
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
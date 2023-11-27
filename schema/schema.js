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
    GraphQLList,
    GraphQLNonNull
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

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}) {
                return fetch(`http://localhost:3000/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName,
                        age
                    })
                })
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
    query: RootQuery,
    mutation
})
const {projects, clients} = require('../sampleData')

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList} = require('graphql')

// Client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

// Project Type
const PorjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return clients.find(client => client.id === parent.id)
            }
        }
    })
})

// Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return clients
            }
        },
        client: {
            type: ClientType,
            args: {id: { type: GraphQLID } },
            resolve(parent, args) {
                return clients.find(client => client.id === args.id)
            }
        },
        project: {
            type: PorjectType,
            args: {id: {type: GraphQLID} },
            resolve(parent, args) {
                return projects.find(project => project.id === args.id)
            }
        },
        projects: {
            type: GraphQLList(PorjectType),
            resolve(parent, args) {
                return projects
            }
        }
    }

})

// If I need to use this Query, I need to export it as a Schema

module.exports = new GraphQLSchema({
    query: RootQuery
})
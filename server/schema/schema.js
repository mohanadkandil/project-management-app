const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql')

// Load Models
const Project = require('../models/Project')
const Client = require('../models/Client')


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
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString },
      client: {
        type: ClientType,
        resolve(parent, args) {
          return Client.findById(parent.clientId)
        },
      },
    }),
})
// Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: {id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        },
        project: {
            type: ProjectType,
            args: {id:  {type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        },
        projects: {
            type: GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find()
            }
        }
    }

})


// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add client to mongoDB
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save()
            }
        },
        // Delete client forn mongoDB
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id)
            }
        },
        // Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            'new' : {value: 'Not Started'},
                            'progress' : {value: 'In Progress'},
                            'completed' : {value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                return project.save()
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id)
            }
        },

        // Update a project
        updateProject: {
            type: ProjectType,
            args: {
              id: { type: GraphQLNonNull(GraphQLID) },
              name: { type: GraphQLString },
              description: { type: GraphQLString },
              status: {
                type: new GraphQLEnumType({
                  name: 'ProjectStatusUpdate',
                  values: {
                    new: { value: 'Not Started' },
                    progress: { value: 'In Progress' },
                    completed: { value: 'Completed' },
                  },
                }),
              },
            },
            resolve(parent, args) {
              return Project.findByIdAndUpdate(
                args.id,
                {
                  $set: {
                    name: args.name,
                    description: args.description,
                    status: args.status,
                  },
                },
                { new: true }
                )
            }

        }
        
    }
})

// If I need to use this Query, I need to export it as a Schema

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})
const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')

const resolvers = {
	Query,
	Mutation,
	AuthPayload
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql', 
	resolvers,
	context: req => ({
		...req,
		db: new Prisma({
			typeDefs: 'src/generated/prisma.graphql',
	  		endpoint: 'http://localhost:4466/hackernews-node/dev',
	  		secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJoYWNrZXJuZXdzLW5vZGVAZGV2Iiwicm9sZXMiOlsiYWRtaW4iXX0sImlhdCI6MTUyMzkxMTI5NCwiZXhwIjoxNTI0NTE2MDk0fQ.y9N0JcDpmMQ8q4-P021-4VdwiiPV4pMBhxjm_WPfI7M',
	  		debug: true,
		})
	}),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))

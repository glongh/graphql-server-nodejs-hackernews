const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: (root, args, context, info) => {
			return context.db.query.links({}, info)
		},
	},
	Mutation: {
		post: (root, args, context, info) => {
			return context.db.mutation.createLink({
				data: {
					url: args.url,
					description: args.description,
				},
			}, info)
		}
	}
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

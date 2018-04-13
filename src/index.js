const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.anyurl.com',
  description: 'This is a description'
}, {
  id: 'link-1',
  url: 'www.anyurl.com',
  description: 'This is a description'
}, {
  id: 'link-2',
  url: 'www.anyurl.com',
  description: 'This is a description'
}]

let idCount = links.length
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
		link: (root, { id }) => links.find(link => link.id === id)
	},
	Mutation: {
		post: (root, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
			}
			links.push(link)
			return link
		},
		deleteLink: (root, { id }) => {
			link = links.find(link => link.id === id)
			links = links.filter(link => link.id !== id)
			return link
		},
		updateLink: (root, args) => {
			//TODO: Implement update link resolver function.
		}
	}
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql', 
	resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))

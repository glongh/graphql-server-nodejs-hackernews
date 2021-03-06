const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

/**
 * Signup mutation
 * Creates a new User
 * @Returns  
 *  - token
 *  - user
 */
async function signup(parent, args, context, info) {
	
	//Encrypting the User’s password
	const password = await bcrypt.hash(args.password, 10)

	//Store the new User using the Prisma instance.
	const user = await context.db.mutation.createUser({
		data: { ...args, password }, 
	}, `{ id }`)

	//Generating JWT signed with APP_SECRET
	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user
	}
}

/**
 * Login mutation
 * Log in user
 * @Returns
 * 	- token
 *	- user
 */
async function login(parent, args, context, info) {

	//Retrieving the User in de database using the Prisma binding
	const user = await context.db.query.user({ where: { email: args.email }}, ` { id password }`)
	if (!user) {
		throw new Error('No such user found')
	}

	//Validating provided password with db password
	const valid = await bcrypt.compare(args.password, user.password)
	if (!valid) {
		throw new Error('Invalid password')
	}

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user
	}
}

/**
 * Post mutation
 * Create link using the User coming in the jwt
 */
async function post(parent, args, context, info) {
	const userId = getUserId(context)
	return await context.db.mutation.createLink({
		data: {
			url: args.url,
			description: args.description,
			postedBy: { connect: { id: userId }},
		},
	}, info)
}


/**
 * Vote mutation
 * Create a vote element that's connected to the User and the Link
 */
async function vote(parent, args, context, info) {
	
	//Validate the incoming JWT with the getUserId helper function
	const userId = getUserId(context)

	const linkExists = await context.db.exists.Vote({
		user: { id: userId },
		link: { id: args.linkId },
	})
	if (linkExists) {
		throw new Error(`Already voted for link: ${args.linkId}`)
	}

	return context.db.mutation.createVote({
		data: {
			user: { connect: { id: userId } },
			link: { connect: { id: args.linkId } },
		},
	}, info)

}

module.exports = {
	signup,
	login,
	post,
	vote
}

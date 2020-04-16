const { ApolloServer, AuthenticationError } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Import Environment Variables and Mongoose Models
require("dotenv").config();

const User = require("./models/User");
const Post = require("./models/Post");

//connect Alas Mongo Cloud Database
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Mongo DB Connected");
  })
  .catch((err) => {
    console.error(err);
  });

const getUser = async (token) => {
  if (token) {
    try {
      let user = await jwt.verify(token, process.env.SECRET);
      console.log(JSON.stringify(user));
      return user;
    } catch (err) {
      throw new AuthenticationError(
        "Your session has ended. Please sign in again."
      );
    }
  }
};

//create Apollo/ GraphQL servers using typeDefs, resolvers, and context objects (mongo models)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => ({
    name: error.name,
    message: error.message.replace("Context creation failed:", ""),
  }),
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  },
});

//start server and listen to port 4000 (default graphql port)
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening ready at ${url}`);
});

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");

//Import Environment Variables and Mongoose Models
require("dotenv").config();

const User = require("./models/User");
const Post = require("./models/Post");

//connect Alas Mongo Cloud Database
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Mongo DB Connected");
  })
  .catch(err => {
    console.error(err);
  });

//create Apollo/ GraphQL servers using typeDefs, resolvers, and context objects (mongo models)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

//start server and listen to port 4000 (default graphql port)
server.listen().then(({ url }) => {
  console.log(`Server Listening ready at ${url}`);
});

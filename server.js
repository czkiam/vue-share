const express = require("express");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
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
  introspection: true,
  playground: true,
  formatError: (error) => ({
    name: error.name,
    message: error.message.replace("Context creation failed:", ""),
  }),
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  },
});

const app = express();
server.applyMiddleware({ app });

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.get("/", function (req, res, next) {
  res.json("Hello World, Express GraphQL");
});

app.get("/configs", function (req, res, next) {
  const envConfig = {
    MONGO_URI: process.env.MONGO_URI,
    SECRET: process.env.SECRET,
    port: process.env.PORT,
  };
  res.json(envConfig);
});

app.get("/apolloServer", function (req, res, next) {
  res.json(server);
});

//start server and listen to port 4000 (default graphql port)
app.listen({ port: process.env.PORT || 4000 }, () => {
  //console.dir(app);
  //console.dir(server);
  console.log(
    `Server ready at http://localhost:${process.env.PORT || 4000}${
      server.graphqlPath
    }`
  );
});

// server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
//   console.log(`Server listening ready at ${url}`);
// });

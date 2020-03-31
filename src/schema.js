// const { gql } = require("apollo-server");

// const typeDefs = gql`
//   type Todo {
//     task: String!
//     completed: Boolean
//   }

//   type Query {
//     getTodos: [Todo]
//   }

//   type Mutation{
//     addTodo(task: String, completed: Boolean) : Todo
//   }
// `;

//Import typeDefs from graphQL file
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

module.exports = typeDefs;

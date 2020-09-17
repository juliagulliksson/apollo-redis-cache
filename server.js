import typeDefs from "./schema";
import resolvers from "./resolvers";

import express from "express";
import { ApolloServer } from "apollo-server-express";

const app = express();
import asyncRedis from "async-redis";
const client = asyncRedis.createClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { client },
});
server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server started on port http://localhost:${PORT}${server.graphqlPath}`
  )
);

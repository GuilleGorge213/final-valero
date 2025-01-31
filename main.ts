import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { typeDefs } from "./gpl/schema.ts";
import { resolvers } from "./resolvers/resolvers.ts";
import { restaurantModel } from "./type.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
const API_KEY = Deno.env.get("API_KEY");
if (!MONGO_URL) {
  console.error("MONGO_URL uri not set on .env");
  throw Error("Error al cargar")
}

if (!API_KEY) {
  console.error("API_URL uri not set on .env");
  throw Error("Error al cargar")
}
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Connected to the dabase")
const db = client.db("finalValero")

const contactCollection = db.collection<restaurantModel>("restaurantModel");


const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ contactCollection }), listen: { port: 5000 }
});
console.info(`Server ready at ${url}`);


/*
async function handler(request: Request): Promise<Response> {
  const metodo = request.method
  const url = new URL(request.url)
  const path = url.pathname

  if (metodo === "GET") {
    if(path === "/test"){
      return new Response(JSON.stringify("Hola"), { status: 200})
    }
  } else if (metodo === "POST") {
   
  } else if (metodo === "PUT") {

  } else if (metodo === "DELETE") {

  }
  return new Response("Method not found", { status: 404 })
}

Deno.serve({ port: 8080 }, handler)
*/
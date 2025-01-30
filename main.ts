import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./gpl/schema.ts"
import { resolvers } from "./resolvers/resolvers.ts"
import { contactModel } from "./type.ts";
/*
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
const db = client.db("practica8")
const contactCollection = db.collection<contactModel>("userModel");



const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ contactCollection }), listen: { port: 5000 }
});
console.info(`Server ready at ${url}`);
*/

//API REST
async function handler(req: Request):Promise<Response> {
  const metodo = req.method
  const url = new URL(req.url)
  const path = url.pathname

  if(metodo === "GET"){
    if(path === "/test"){
      return new Response("Hola")
    }
  } else if(metodo === "POST"){
    
  } else if(metodo === "PUT"){

  } else if(metodo === "DELETE"){

  }
  return new Response("Method not found",{status: 404})
}

Deno.serve({port: 8080},handler)

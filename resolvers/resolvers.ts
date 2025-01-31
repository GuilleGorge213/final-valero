import { GraphQLError } from "graphql";
import { Collection, ObjectId } from "mongodb";
import { APICity, APIPhone, APITime, APIWeather, restaurantModel } from "../type.ts";

type Context = {
    contactCollection: Collection<restaurantModel>;
}

export const resolvers = {
    Restaurant: {
        id: (parent: restaurantModel) => parent._id?.toString(),

        direccion: async (parent: restaurantModel) => {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) throw new GraphQLError("API KEY not set")
            const url = "https://api.api-ninjas.com/v1/city?name=" + parent.ciudad
            const data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            })
            if (data.status !== 200) throw new GraphQLError("An error ocurred while calling the City API.")
            const response2: APICity[] = await data.json()
            return parent.direccion + "," + parent.ciudad + "," + response2[0].country
        },
        temperatura: async (parent: restaurantModel) => {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) throw new GraphQLError("API KEY not set")
            let url = "https://api.api-ninjas.com/v1/city?name=" + parent.ciudad
            let data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            })
            if (data.status !== 200) throw new GraphQLError("An error ocurred while calling the City API.")
            const response: APICity[] = await data.json()
            url = "https://api.api-ninjas.com/v1/weather?lat=" + response[0].latitude + "&lon=" + response[0].longitude;
            data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            })
            if (data.status !== 200) throw new GraphQLError("An error ocurred while calling the Weather API.")
            const response2: APIWeather = await data.json()
            return response2.temp + "ºC"
        },
        hora: async (parent: restaurantModel) => {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) throw new GraphQLError("API KEY not set")
            const url = "https://api.api-ninjas.com/v1/worldtime?timezone=" + parent.timezones
            const data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }

            })
            if (data.status !== 200) throw new GraphQLError("An error ocurred while calling the WorldTime API.")
            const response: APITime = await data.json()
            return response.hour + ":" + response.minute
        },


    },
    Query: {
        getRestaurant: async (_: unknown, args: { id: string }, ctx: Context): Promise<restaurantModel | null> => {
            return await ctx.contactCollection.findOne({ _id: new ObjectId(args.id) })
        },
        getRestaurants: async (_: unknown, args: { ciudad: string }, ctx: Context): Promise<restaurantModel[]> => {
            return await ctx.contactCollection.find({ ciudad: args.ciudad }).toArray()
        }
    },

    Mutation: {
        deleteRestaurant: async (_: unknown, args: { id: string }, ctx: Context): Promise<boolean> => {
            const { deletedCount } = await ctx.contactCollection.deleteOne({ _id: new ObjectId(args.id) })
            return deletedCount === 1;
        },

        addRestaurant: async (_: unknown, args: { nombre: string, direccion: string, ciudad: string, telefono: string }, ctx: Context): Promise<restaurantModel> => {
            const API_KEY = Deno.env.get("API_KEY");
            if (!API_KEY) throw new GraphQLError("API KEY not set")
            //1ra validación de si ya existe
            const existsAlready = await ctx.contactCollection.findOne({ telefono: args.telefono });
            if (existsAlready) throw new GraphQLError("The phone is already in use");
            const url = "https://api.api-ninjas.com/v1/validatephone?number=" + args.telefono
            const data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            }
            )
            if (data.status !== 200) throw new GraphQLError("An error ocurred while calling the Phone API.")
            const response: APIPhone = await data.json()
            //2da validacion de telefono
            if (!response.is_valid) throw new GraphQLError("The informed phone is not correctly set.")
            const { insertedId } = await ctx.contactCollection.insertOne({
                nombre: args.nombre,
                ciudad: args.ciudad,
                direccion: args.direccion,
                telefono: args.telefono,
                timezones: response.timezones[0]
            })

            return {
                _id: insertedId,
                nombre: args.nombre,
                ciudad: args.ciudad,
                direccion: args.direccion,
                telefono: args.telefono,
                timezones: response.timezones[0]
            }
        }
    }
}


import { Collection, ObjectId } from "mongodb";
import { GraphQLError } from "graphql";
import { contactModel } from "../type.ts";

type Context = {
    contactCollection: Collection<contactModel>;
}

export const resolvers = {

    Query: {
        test: (): string => "Test"
    }

}


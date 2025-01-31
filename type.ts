import { OptionalId } from "mongodb";

export type restaurantModel = OptionalId<{
    nombre: string,
    direccion: string,
    ciudad: string,
    telefono: string,
    timezones: string,
}>;

export type APIPhone = {
    is_valid: boolean,
    timezones: string,
}

export type APITime = {
    hour: string,
    minute: string,
}

export type APICity = {
    latitude: string,
    longitude: string,
    country : string
}

export type APIWeather = {
    temp: string,
}


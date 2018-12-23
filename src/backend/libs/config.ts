import { log, readFile, writeFile } from "./utils";
import { Route } from "src/shared/admin-api";

const prettyJSON = require("pretty-json-stringify");
const sampleConfig = require("../config.sample.json");

export interface Config
{
    session_secret: string;
    admin_password: string;
    ports: {
        http: number;
        https: number;
        letsencrypt: number;
        admin: number;
    },
    routes: Route[]
}

export async function loadConfig<T extends {} = Config>(path: string = "./config.json"): Promise<T>
{
    let config = sampleConfig;
    try
    {
        const newConf = JSON.parse((await readFile(path)).toString());
        Object.keys(newConf)
            .filter(  key => newConf[key] !== undefined )
            .forEach( key => config[key] = newConf[key] );
    }
    catch(err)
    {
        if (err.code !== "ENOENT")
        throw new Error("Error reading configuration: " + err.toString());
    }

    try 
    {
        await writeFile(path, prettyJSON(config, {
            shouldExpand : (object: any, level: any) => {
                if (Array.isArray(object) && object.length < 2) return false;
                if (level >= 2) return false;
                return true;
            }
        }));
    }
    catch(err2)
    {
        throw new Error("Error writing configuration: " + err2.toString());
    }

    return config as T;
}

export async function saveConfig<T extends {} = Config>(config: Partial<T>, path: string = "./config.json")
{
    Object.keys(sampleConfig)
        .filter(  key => (<any>config)[key] === undefined )
        .forEach( key => (<any>config)[key] = sampleConfig[key] );
        
    try 
    {
        await writeFile(path, prettyJSON(config, {
            shouldExpand : (object: any, level: any) => {
                if (Array.isArray(object) && object.length < 2) return false;
                if (level >= 2) return false;
                return true;
            }
        }));
    }
    catch(err2)
    {
        throw new Error("Error writing configuration: " + err2.toString());
    }
}

export async function updateConfig<T extends {} = Config>(config: Partial<T>, path: string = "./config.json")
{
    const oldconf = await loadConfig(path);

    Object.keys(oldconf)
        .filter(  key => (<any>config)[key] === undefined )
        .forEach( key => (<any>config)[key] = (<any>oldconf)[key] );

    return saveConfig(config, path);
}
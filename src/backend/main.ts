
import { createServer } from "http";
import { loadConfig, updateConfig } from "./libs/config";
import express = require("express");
import { static as serveStatic, Router } from "express";
import { join } from "path";
import { json, urlencoded } from "body-parser";
import session = require("express-session");
import { log, randomSequence } from "./libs/utils";

import {redbird} from "./libs/redbird";
import { RouteStorage } from "./storage";
import { registerAPI } from "./api";

const path = (...str: string[]) => join(__dirname, ...str);
const config_path = "./config.json"

export async function main()
{
    log.main("Starting server...");

    const config = await loadConfig(config_path);
    if (config.session_secret === "replace me")
    {
        config.session_secret = randomSequence(12);
        await updateConfig({session_secret: config.session_secret}, config_path);
    }

    const proxy = redbird({
        port: config.ports.http,
        letsencrypt: {
          path: path("certs"),
          port: config.ports.letsencrypt 
        },
        ssl: {
          http2: true,
          port: config.ports.https, 
        },
        bunyan: false
    });
    const routeStorage = new RouteStorage(config_path, proxy);
    const app = express();
    const server = createServer(app);
    
    app.use(serveStatic(path("www"), {index: ["index.html"]}));
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(session({
        secret: config.session_secret,
        resave: false,
        saveUninitialized: true,
        cookie: {}
    }));
    
    const apiRouter = Router();
    registerAPI(apiRouter, routeStorage);
    app.use("/api", apiRouter);

    server.listen(config.ports.admin, () => {
        log.main(`Server started. Listening on port ${config.ports.admin}.`);
    });
}
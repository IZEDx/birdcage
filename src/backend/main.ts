
import { createServer } from "http";
import { loadConfig, updateConfig } from "./libs/config";
import express = require("express");
import { static as serveStatic, Router } from "express";
import { join } from "path";
import { json, urlencoded } from "body-parser";
import session = require("express-session");
import { log, randomSequence, readFile } from "./libs/utils";

import {redbird} from "./libs/redbird";
import { RouteStorage } from "./storage";
import { registerAPI } from "./api";
import { Auth } from "./auth";

const path = (...str: string[]) => join(__dirname, ...str);
const config_path = "./birdcage.json"

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
          path: config.certificates,
          port: config.ports.letsencrypt 
        },
        ssl: {
          http2: false,
          port: config.ports.https, 
        },
        bunyan: false
    });


    const page404 = await readFile(config["404path"], await readFile(path("www", "404.html")))
    proxy.notFound((req, res) => {
        res.statusCode = 404;
        res.write(page404);
        res.end();
    })

    const routeStorage = new RouteStorage(config_path, config.production, proxy);
    await routeStorage.load();

    const auth = new Auth(config_path)
    await auth.load();

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
    registerAPI(apiRouter, routeStorage, auth);
    app.use("/api", apiRouter);

    server.listen(config.ports.admin, () => {
        log.main(`Server started.`);
        log.main(`Admin Panel listening on port ${config.ports.admin}.`);
        log.main(`HTTP Proxy listening on port ${config.ports.http}.`);
        log.main(`HTTPS Proxy listening on port ${config.ports.https}.`);
    });
}
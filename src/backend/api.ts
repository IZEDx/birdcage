
import { AdminAPI } from "../shared/admin-api";
import RestypedRouter from 'restyped-express-async';
import { Router } from "express";
import { RouteStorage } from "./storage";
import { log } from "./libs/utils";

export function registerAPI(apiRouter: Router, storage: RouteStorage)
{
    const router = RestypedRouter<AdminAPI>(apiRouter);

    router.get("/routes", async req => {
    
        return storage.routes;
    });

    router.post("/routes", async req => {
        const {source, target} = req.body;

        try
        {
            await storage.register(source, target);
            log.interaction(`Added route: ${source} -> ${target}`);
            return { success: true };
        }
        catch(err)
        {
            log.error(`Error adding route: ${err.toString()}`);
            return { success: false, error: err.toString() };
        }

    });

    router.delete("/routes/:source/:target", async req => {
        const {source, target} = req.params;
        
        try
        {
            await storage.unregister(source, target);
            log.interaction(`Deleted route: ${source} -> ${target}`);
            return { success: true };
        }
        catch(err)
        {
            log.error(`Error deleting route: ${err.toString()}`);
            return { success: false, error: err.toString() };
        }
    });
}


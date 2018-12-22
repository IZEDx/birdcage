
import { AdminAPI } from "../shared/admin-api";
import RestypedRouter from 'restyped-express-async';
import { Router } from "express";
import { RouteStorage } from "./storage";

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
            return { success: true };
        }
        catch(err)
        {
            return { success: false, error: err.toString() };
        }

    });
}


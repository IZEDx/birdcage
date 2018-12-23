
import { AdminAPI } from "../shared/admin-api";
import RestypedRouter, { TypedRequest } from 'restyped-express-async';
import { Router } from "express";
import { RouteStorage } from "./storage";
import { log } from "./libs/utils";
import { Auth } from "./auth";
import { RestypedRoute } from "restyped";

const authed = (req: TypedRequest<any>) => !!(req.session && req.session.authed);

export function registerAPI(apiRouter: Router, storage: RouteStorage, auth: Auth)
{
    const router = RestypedRouter<AdminAPI>(apiRouter);

    router.get("/auth", async req => ({authed: authed(req)}));

    router.put("/auth", async req => {
        const pw = req.body.password;

        if (!authed(req))
        {
            return { success: false, error: "Not logged in!" };
        }

        try
        {
            await auth.setPassword(pw)
            return {success: true};
        }
        catch(err)
        {
            log.error(`Error setting password: ${err.toString()}`);
            return { success: false, error: err.toString() };
        }
    });

    router.post("/auth", async req => {
        const pw = req.body.password;
        try
        {
            if (await auth.checkPassword(pw))
            {
                if (req.session) req.session.authed = true;
                return {success: true};
            }
            else
            {
                return {success: false, error: "Wrong password!"};
            }
        }
        catch(err)
        {
            log.error(`Error checking password: ${err.toString()}`);
            return { success: false, error: err.toString() };
        }
    });

    router.get("/routes", async req => {
    
        if (!authed(req))
        {
            return [];
        }
        return storage.routes;
    });

    router.post("/routes", async req => {
        const {source, target} = req.body;

        if (!authed(req))
        {
            return { success: false, error: "Not logged in!" };
        }

        try
        {
            await storage.register(req.body);
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

        if (!authed(req))
        {
            return { success: false, error: "Not logged in!" };
        }

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


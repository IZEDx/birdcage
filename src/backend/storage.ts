import { loadConfig, Config, updateConfig } from "./libs/config";
import { ReverseProxy } from "./libs/redbird";
import { Route } from "src/shared/admin-api";



export class RouteStorage
{
    routes: Route[] = [];

    constructor(private path: string, private proxy: ReverseProxy)
    {
    }

    async load()
    {
        const config = await loadConfig(this.path);
        this.routes = config.routes;
        for (const route of this.routes)
        {
            this.proxy.register(route.source, route.target);
        }
    }

    async register(route: Route)
    {
        if (route.ssl && route.email === "")
        {
            throw new Error("Need to specify an email address when using ssl");
        }

        const {source, target} = route;
        const idx = this.routes.findIndex(r => r.source === source && r.target === target);
        if (idx >= 0)
        {
            this.routes.splice(idx, 1);
            this.proxy.unregister(source, target);
        }
        this.proxy.register(source, target, !route.ssl ? {} : {
            ssl: {
                letsencrypt: {
                    email: route.email,
                    production: true
                }
            }
        });
        this.routes = [route, ...this.routes];
        return updateConfig<Config>({routes: this.routes});
    }

    async unregister(source: string, target: string)
    {
        const idx = this.routes.findIndex(r => r.source === source && r.target === target);
        if (idx >= 0)
        {
            this.routes.splice(idx, 1);
            this.proxy.unregister(source, target);
            return updateConfig<Config>({routes: this.routes});
        }
        throw new Error("Route doesn't exist!");
    }

}

import { loadConfig, Config, updateConfig } from "./libs/config";
import { ReverseProxy } from "./libs/redbird";
import { Route } from "src/shared/admin-api";



export class RouteStorage
{
    routes: Route[] = [];

    constructor(private path: string, private production: boolean, private proxy: ReverseProxy)
    {
    }

    async load()
    {
        const config = await loadConfig(this.path);
        this.routes = config.routes;
        for (const route of this.routes)
        {
            this.registerRoute(route);
        }
    }

    private registerRoute(route: Route)
    {
        this.proxy.register(route.source, route.target, !route.ssl ? {} : {
            ssl: {
                letsencrypt: {
                    email: route.email,
                    production: this.production
                }
            }
        });
    }

    private findRoute(source: string, target: string): {route: Route, idx: number}|undefined
    {
        const idx = this.routes.findIndex(r => r.source === source && r.target === target);
        return idx >= 0 ? {route: this.routes[idx], idx} : undefined;
    }

    public getRoute(source: string, target: string): Route|undefined
    {
        const result = this.findRoute(source, target);
        return result ? result.route : undefined;
    }

    private removeRoute(idx: number)
    {
        this.routes.splice(idx, 1);
    }

    async register(route: Route)
    {
        if (route.ssl && route.email === "")
        {
            throw new Error("Need to specify an email address when using ssl");
        }

        const result = this.findRoute(route.source, route.target);
        if (result)
        {
            this.removeRoute(result.idx);
            this.proxy.unregister(route.source, route.target);
        }
        this.registerRoute(route);
        this.routes = [route, ...this.routes];
        return updateConfig<Config>({routes: this.routes}, this.path);
    }

    async unregister(source: string, target: string)
    {
        const result = this.findRoute(source, target);
        if (result)
        {
            this.removeRoute(result.idx);
            this.proxy.unregister(source, target);
            return updateConfig<Config>({routes: this.routes}, this.path);
        }
        throw new Error("Route doesn't exist!");
    }

}

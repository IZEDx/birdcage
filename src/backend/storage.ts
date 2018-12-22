import { loadConfig, Config, updateConfig } from "./libs/config";
import { ReverseProxy } from "./libs/redbird";



export class RouteStorage
{
    routes: Config["routes"] = [];

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

    async register(source: string, target: string)
    {
        if (this.routes.filter(r => r.source === source && r.target === target).length === 0)
        {
            this.routes.push({source, target});
            this.proxy.register(source, target);
            return updateConfig<Config>({routes: this.routes});
        }
        throw new Error("Route already exists!");
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

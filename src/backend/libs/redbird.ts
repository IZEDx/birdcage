
export const redbird = require("redbird") as Redbird;

export type Redbird = (options: RedbirdOptions) => ReverseProxy;

export type RedbirdOptions = {
    port?: number,
    letsencrypt?: {
        path?: string,
        port?: number 
    },
    ssl?: {
        http2?: boolean,
        port?: number,
    }
    bunyan?: {}|false
};

export interface ReverseProxy
{
    register(vhost: string, target: string, options?: {}): ReverseProxy;
    unregister(vhost: string, target: string): ReverseProxy;
}

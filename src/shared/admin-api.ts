
export interface Route
{
    source: string;
    target: string;
    ssl: boolean;
    email: string;
}

export interface AdminAPI {
    "/auth": {
        GET: {
            response: {
                authed: boolean
            }
        },
        POST: {
            body: {
                password: string
            },
            response: {
                success: boolean
                error?: string
            }
        },
        PUT: {
            body: {
                password: string
            },
            response: {
                success: boolean
                error?: string
            }
        },
        DELETE: {
            response: {
                success: boolean
                error?: string
            }
        }
    }
    "/routes": {
        POST: {
            body: Route
            response: {
                success: boolean
                error?: string
            }
        },
        GET: {
            response: Route[]
        }
    },
    "/routes/:source/:target": {
        PUT: {
            params: {
                source: string,
                target: string
            },
            body: Route,
            response: {
                success: boolean
                error?: string
            }
        },
        DELETE: {
            params: {
                source: string,
                target: string
            },
            response: {
                success: boolean
                error?: string
            }
        }
    }
  }
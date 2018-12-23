
export interface Route
{
    source: string;
    target: string;
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
        }
    }
    '/routes': {
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
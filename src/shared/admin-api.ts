
export interface Route
{
    source: string;
    target: string;
}

export interface AdminAPI {
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
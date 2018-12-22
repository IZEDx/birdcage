
export interface Route
{
    source: string;
    target: string;
}

export interface AdminAPI {
    '/routes': {
        POST: {
            body: {
                source: string
                target: string
            }
            response: {
                success: boolean
                error?: string
            }
        },
        GET: {
            response: Route[]
        }
    }
  }
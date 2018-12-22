import { Router, Request, Response } from "express-serve-static-core";
import { Spring } from "plumbing-toolkit";

export type ReqRes = {req: Request, res: Response};

export function GET(app: Router, path: "string"): Spring<ReqRes>
{
    return sink => {
        app.get(path, (req, res) => {
            if (!sink.plucked) {
                sink.next({req, res});
            }
        })
        return () => {};
    }
}
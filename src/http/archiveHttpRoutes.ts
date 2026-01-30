import { OGSHError } from "@open-game-server-host/backend-lib";
import { Request, Response, Router } from "express";
import { existsSync } from "node:fs";
import { getArchivePath } from "../utils";

export const archiveHttpRouter = Router();

interface ArchiveLocals {
    appId: string;
    variantId: string;
    versionId: string;
    build: number;
}
type ArchiveResponse = Response<any, ArchiveLocals>;

archiveHttpRouter.put("/", async (req: Request, res: ArchiveResponse) => {
    // TODO this will be used by CI/CD to deploy new archives
});

archiveHttpRouter.get("/", async (req: Request, res: ArchiveResponse) => {
    // TODO each daemon will have its own API key that has to be validated here

    const { appId, variantId, versionId, build } = res.locals;
    const path = getArchivePath(appId, variantId, versionId, build);
    if (!existsSync(path)) {
        throw new OGSHError("app/version-not-found", `could not find file for app id '${appId}' variant id '${variantId}' version id '${versionId}' build '${build}' (path: ${path})`);
    }

    // TODO log download started
    // TODO log download finished
    res.download(path);
});

archiveHttpRouter.delete("/", async (req: Request, res: ArchiveResponse) => {
    // TODO this will be used by a cron job to delete old archives - it has to be called by something else because this app is designed to be stateless for multiple instances
});
import { Logger, OGSHError } from "@open-game-server-host/backend-lib";
import { Request, Response, Router } from "express";
import { createReadStream, existsSync, statSync } from "node:fs";
import { getArchiveName, getArchivePath } from "../utils";

export const archiveHttpRouter = Router();

interface ArchiveLocals {
    appId: string;
    variantId: string;
    versionId: string;
    build: number;
}
type ArchiveResponse<T = any> = Response<T, ArchiveLocals>;

// TODO each daemon will have its own API key that has to be validated here
let downloads = 0;
archiveHttpRouter.get("/", async (req: Request, res: ArchiveResponse) => {
    const { appId, variantId, versionId, build } = res.locals;
    const path = getArchivePath(appId, variantId, versionId, build);
    if (!existsSync(path)) {
        throw new OGSHError("app/version-not-found", `could not find file for app id '${appId}' variant id '${variantId}' version id '${versionId}' build '${build}' (path: ${path})`);
    }

    const logger = new Logger(`DOWNLOADS: ${++downloads}`);
    const name = `${appId} / ${variantId} / ${versionId} / ${build}`;
    logger.info(`Started downloading ${name}`);

    res.setHeader("Content-Disposition", `attachment; filename="${getArchiveName(appId, variantId, versionId, build)}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", statSync(path).size);

    const readStream = createReadStream(path);
    readStream.on("error", error => {
        throw new OGSHError("general/unspecified", error);
    });
    readStream.on("close", () => logger.info(`Finished downloading ${name}`));

    readStream.pipe(res);
});

archiveHttpRouter.delete("/", async (req: Request, res: ArchiveResponse) => {
    // TODO this will be used by a cron job to delete old archives - it has to be called by something else because this app is designed to be stateless for multiple instances
});

interface ExistsResponse {
    exists: boolean;
}
archiveHttpRouter.get("/exists", (req: Request, res: ArchiveResponse<ExistsResponse>) => {
    const { appId, variantId, versionId, build } = res.locals;
    const path = getArchivePath(appId, variantId, versionId, build);
    res.send({
        exists: existsSync(path)
    });
});
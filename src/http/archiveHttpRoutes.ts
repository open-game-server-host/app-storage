import { Logger, OGSHError } from "@open-game-server-host/backend-lib";
import { Request, Response, Router } from "express";
import multer from "multer";
import { existsSync, renameSync } from "node:fs";
import { getArchivePath } from "../utils";

export const archiveHttpRouter = Router();

interface ArchiveLocals {
    appId: string;
    variantId: string;
    versionId: string;
    build: number;
}
type ArchiveResponse = Response<any, ArchiveLocals>;

const uploadLogger = new Logger("UPLOAD");
archiveHttpRouter.put("/", multer({ dest: "archives", preservePath: true }).single("file"), async (req: Request, res: ArchiveResponse) => {
    // TODO internal request auth middleware before multer

    const { appId, variantId, versionId, build } = res.locals;
    const path = getArchivePath(appId, variantId, versionId, build);
    renameSync(`${req.file?.destination}/${req.file?.filename}`, path);
    uploadLogger.info(`${appId} / ${variantId} / ${versionId} / ${build}`);

    res.send();
});

// TODO each daemon will have its own API key that has to be validated here
let downloads = 0;
archiveHttpRouter.get("/", async (req: Request, res: ArchiveResponse) => {
    const { appId, variantId, versionId, build } = res.locals;
    const path = getArchivePath(appId, variantId, versionId, build);
    if (!existsSync(path)) {
        throw new OGSHError("app/version-not-found", `could not find file for app id '${appId}' variant id '${variantId}' version id '${versionId}' build '${build}' (path: ${path})`);
    }

    const logger = new Logger(`${++downloads}`);
    const name = `${appId} / ${variantId} / ${versionId} / ${build}`;
    logger.info(`Started downloading ${name}`);
    res.download(path, error => {
        if (error) {
            throw new OGSHError("general/unspecified", error)
        }
        logger.info(`Finished downloading ${name}`);
    });
});

archiveHttpRouter.delete("/", async (req: Request, res: ArchiveResponse) => {
    // TODO this will be used by a cron job to delete old archives - it has to be called by something else because this app is designed to be stateless for multiple instances
});
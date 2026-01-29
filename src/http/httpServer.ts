import { expressErrorHandler, Logger } from "@open-game-server-host/backend-lib";
import express from "express";
import { param } from "express-validator";
import { archiveHttpRouter } from "./archiveHttpRoutes";

export async function initHttpServer(logger: Logger) {
    const router = express();
    router.use(express.json());

    router.use("/v1/archive/:appId/:variantId/:versionId/:build", [
        param("appId").isString(),
        param("variantId").isString(),
        param("versionId").isString(),
        param("build").isInt().toInt()
    ], archiveHttpRouter);

    router.use(expressErrorHandler);

    const port = 8080; // TODO should this be a config or just hard coded?
    await new Promise<void>(res => {
        router.listen(port, () => {
            logger.info(`Started http server on port ${port}`);
            res();
        });
    });
}
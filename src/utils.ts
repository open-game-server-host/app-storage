import { constants } from "./constants";

export function getArchivePath(appId: string, variantId: string, versionId: string, build: number): string {
    const mountPath = constants.archives_mount_path.endsWith("/") ? constants.archives_mount_path : `${constants.archives_mount_path}/`;
    return `${mountPath}${appId}-${variantId}-${versionId}-${build}.7z`;
}
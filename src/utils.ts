import { constants } from "./constants";

export function getArchiveName(appId: string, variantId: string, versionId: string, build: number): string {
    return `${appId}-${variantId}-${versionId}-${build}.7z`;
}

export function getArchivePath(appId: string, variantId: string, versionId: string, build: number): string {
    const mountPath = constants.archives_mount_path.endsWith("/") ? constants.archives_mount_path : `${constants.archives_mount_path}/`;
    return `${mountPath}${getArchiveName(appId, variantId, versionId, build)}`;
}
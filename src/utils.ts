import { constants } from "./constants";

export function getArchivePath(appId: string, variantId: string, versionId: string, build: number): string {
    return `${constants.archives_mount_path}${appId}-${variantId}-${versionId}-${build}.7z`;
}
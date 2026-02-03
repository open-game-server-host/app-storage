import { parseEnvironmentVariables } from "@open-game-server-host/backend-lib";

const parsedVariables = parseEnvironmentVariables([
    {
        key: "APP_STORAGE_CONFIG_BRANCH",
        defaultValue: "main"
    }
]);

export function getAppStorageConfigBranch(): string {
    return parsedVariables.get("APP_ARCHIVE_CONFIG_BRANCH")!;
}
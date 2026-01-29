import { parseEnvironmentVariables } from "@open-game-server-host/backend-lib";

const parsedVariables = parseEnvironmentVariables([
    {
        key: "APP_ARCHIVE_CONFIG_BRANCH",
        defaultValue: "main"
    }
]);

export function getAppArchiveConfigBranch(): string {
    return parsedVariables.get("APP_ARCHIVE_CONFIG_BRANCH")!;
}
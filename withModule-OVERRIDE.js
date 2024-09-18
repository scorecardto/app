"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withModule = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_plugins_1 = require("@expo/config-plugins");
const module_template_1 = require("./module-template");
const logger_1 = require("../utils/logger");
const withModule = (config, options) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (newConfig) => {
            const { modRequest } = newConfig;
            const projectRoot = modRequest.projectRoot;
            const platformRoot = modRequest.platformProjectRoot;
            const widgetFolderPath = path_1.default.join(modRequest.projectRoot, options.src, 'src/main/java/package_name');
            const androidFolder = path_1.default.join(__dirname, '../../../android/src/main/java/expo/modules/widgets/');
            const packageName = config_plugins_1.AndroidConfig.Package.getPackage(config);
            if (!packageName) {
                throw new Error(`ExpoWidgets:: app.(ts/json) must provide a value for android.package.`);
            }
            const packageNameAsPath = packageName?.replace(/\./g, "/");
            const moduleSourcePath = path_1.default.join(widgetFolderPath, 'Module.kt');
            const moduleDestinationPath = path_1.default.join(androidFolder, 'ExpoWidgetsModule.kt');
            if (!fs_extra_1.default.existsSync(moduleSourcePath)) {
                logger_1.Logging.logger.debug('No module file found. Adding template...');
                const contents = (0, module_template_1.getTemplate)(packageName);
                fs_extra_1.default.writeFileSync(moduleDestinationPath, contents);
            }
            else {
                fs_extra_1.default.copyFileSync(moduleSourcePath, moduleDestinationPath);
            }

            if (options.moduleDependencies) {
                for (const dep of options.moduleDependencies) {
                    const filePath = path_1.default.join(widgetFolderPath, dep)
                    const destination = path_1.default.join(androidFolder, path_1.default.basename(dep))
                    logger_1.Logging.logger.debug(`Copying ${filePath} to ${destination}`)
                    fs_extra_1.default.copyFileSync(filePath, destination)
                }
            }

            return newConfig;
        }
    ]);
};
exports.withModule = withModule;
#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
var axios_1 = __importDefault(require("axios"));
var useYarn = !process.argv.some(function (arg) { return arg === '--use-npm'; });
var makeFile = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var readmeText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("adding " + url + "...");
                return [4, axios_1["default"].get("https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/" + url)];
            case 1:
                readmeText = (_a.sent()).data;
                return [4, new Promise(function (resolve, reject) {
                        return fs_1["default"].writeFile(url, readmeText, function (err) {
                            if (err)
                                reject(err);
                            resolve();
                        });
                    })];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
var makeDir = function (dirName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, new Promise(function (resolve, reject) {
                    return fs_1["default"].mkdir(dirName, function (err) {
                        if (err)
                            reject(err);
                        resolve();
                    });
                })];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var runCommand = function (cmd, rejectStdErr) {
    if (rejectStdErr === void 0) { rejectStdErr = true; }
    return new Promise(function (resolve, reject) {
        child_process_1.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(error);
                return;
            }
            if (stderr && rejectStdErr && stderr.toLowerCase().indexOf('warn') === -1) {
                reject(stderr);
                return;
            }
            resolve();
        });
    });
};
var configurePackage = function (pkg, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("installing " + pkg + "...");
                return [4, runCommand(useYarn ? "yarn add -D " + pkg : "npm i --save-dev " + pkg)];
            case 1:
                _a.sent();
                if (!fileName) return [3, 3];
                return [4, makeFile(fileName)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2];
        }
    });
}); };
var runSetup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var operations, packageConfig_1, err_1, makeSourceCode, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                operations = [];
                console.log("Creating TypeScript Boilerplate using " + (useYarn ? 'yarn' : 'npm') + "...");
                console.log('configuring package.json...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 2, , 4]);
                packageConfig_1 = JSON.parse(fs_1["default"].readFileSync('package.json').toString());
                return [3, 4];
            case 2:
                err_1 = _a.sent();
                console.log('package.json does not exist. Creating one...');
                return [4, runCommand(useYarn ? 'yarn init -y' : 'npm init -y', false)];
            case 3:
                _a.sent();
                packageConfig_1 = JSON.parse(fs_1["default"].readFileSync('package.json').toString());
                return [3, 4];
            case 4:
                packageConfig_1 = __assign(__assign({}, packageConfig_1), { main: 'dist/index.js', scripts: __assign(__assign({}, packageConfig_1.scripts), { prestart: 'npm run rebuild', start: 'node .', dev: 'nodemon .', build: 'tsc', rebuild: 'npm run clean && npm run build', clean: 'rm -rf dist/*' }) });
                operations.push(new Promise(function (resolve, reject) {
                    fs_1["default"].writeFile('package.json', JSON.stringify(packageConfig_1), function (err) {
                        if (err)
                            reject(err);
                        resolve();
                    });
                }));
                operations.push(configurePackage('typescript', 'tsconfig.json'));
                operations.push(configurePackage('nodemon', 'nodemon.json'));
                operations.push(makeFile('READEME.md'));
                makeSourceCode = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, makeDir('src')];
                            case 1:
                                _a.sent();
                                return [4, makeFile('src/index.ts')];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                }); };
                operations.push(makeSourceCode());
                operations.push(makeFile('.gitignore'));
                return [4, Promise.all(operations)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _a.trys.push([6, , 8, 9]);
                return [4, runCommand('git init')];
            case 7:
                _a.sent();
                return [3, 9];
            case 8: return [7];
            case 9:
                console.log('setup complete. happy coding! :)');
                return [3, 11];
            case 10:
                err_2 = _a.sent();
                console.log('oops... something went wrong:');
                console.log(err_2);
                return [3, 11];
            case 11: return [2];
        }
    });
}); };
runSetup();
//# sourceMappingURL=index.js.map
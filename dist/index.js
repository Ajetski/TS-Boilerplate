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
var fs_1 = require("fs");
var axios_1 = __importDefault(require("axios"));
var args = process.argv.slice(-2);
var useYarn = !args.some(function (arg) { return arg === '--use-npm'; });
var projectFolder = args.find(function (arg) { return arg.indexOf('npx') === -1
    && arg.indexOf('yarn') === -1
    && arg.indexOf('--use-npm') === -1
    && arg.indexOf('create') === -1
    && arg.indexOf('tsb') === -1; });
console.log("folder: " + projectFolder);
var makeFileAsync = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("adding " + url + "...");
                return [4, axios_1["default"].get("https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/" + url)];
            case 1:
                data = (_a.sent()).data;
                if (typeof data === 'object')
                    data = JSON.stringify(data);
                return [4, new Promise(function (resolve, reject) {
                        return fs_1.writeFile(projectFolder ? projectFolder + "/" + url : url, data, function (err) {
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
var makeDirAsync = function (dirName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, new Promise(function (resolve, reject) {
                    return fs_1.mkdir(projectFolder ? projectFolder + "/" + dirName : dirName, { recursive: true }, function (err) {
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
var readFileAsync = function (fileName) { return new Promise(function (resolve, reject) {
    return fs_1.readFile(projectFolder ? projectFolder + "/" + fileName : fileName, function (err, data) {
        if (err) {
            reject(err);
            return;
        }
        resolve(data.toString());
    });
}); };
var runCommand = function (cmd, rejectStdErr) {
    if (rejectStdErr === void 0) { rejectStdErr = true; }
    return new Promise(function (resolve, reject) {
        console.log("running command: '" + cmd + "'");
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
                return [4, runCommand(projectFolder ? "cd " + projectFolder + "; " : '' + useYarn ? "yarn add -D " + pkg : "npm i --save-dev " + pkg)];
            case 1:
                _a.sent();
                if (!fileName) return [3, 3];
                return [4, makeFileAsync(fileName)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2];
        }
    });
}); };
var runSetup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var operations, managePackages, makeSourceCode, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (projectFolder) {
                    console.log("creating " + projectFolder + " project folder...");
                    fs_1.mkdirSync(projectFolder);
                }
                operations = [];
                console.log("Creating TypeScript Boilerplate using " + (useYarn ? 'yarn' : 'npm') + "...");
                managePackages = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var packageConfig, _a, _b, err_2, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                console.log('configuring package.json...');
                                _e.label = 1;
                            case 1:
                                _e.trys.push([1, 3, , 6]);
                                _b = (_a = JSON).parse;
                                return [4, readFileAsync('package.json')];
                            case 2:
                                packageConfig = _b.apply(_a, [_e.sent()]);
                                return [3, 6];
                            case 3:
                                err_2 = _e.sent();
                                console.log('package.json does not exist. Creating one...');
                                return [4, runCommand((projectFolder ? "cd " + projectFolder + " && " : '') + (useYarn ? 'yarn init -y' : 'npm init -y'), false)];
                            case 4:
                                _e.sent();
                                _d = (_c = JSON).parse;
                                return [4, readFileAsync('package.json')];
                            case 5:
                                packageConfig = _d.apply(_c, [_e.sent()]);
                                return [3, 6];
                            case 6:
                                packageConfig = __assign(__assign({}, packageConfig), { main: 'dist/index.js', scripts: __assign(__assign({}, packageConfig.scripts), { prestart: 'npm run rebuild', start: 'node .', dev: 'nodemon .', build: 'tsc', rebuild: 'npm run clean && npm run build', clean: 'rm -rf dist/*' }) });
                                return [4, new Promise(function (resolve, reject) {
                                        fs_1.writeFile('package.json', JSON.stringify(packageConfig), function (err) {
                                            if (err)
                                                reject(err);
                                            resolve();
                                        });
                                    })];
                            case 7:
                                _e.sent();
                                return [4, configurePackage('typescript', 'tsconfig.json')];
                            case 8:
                                _e.sent();
                                return [4, configurePackage('nodemon', 'nodemon.json')];
                            case 9:
                                _e.sent();
                                return [2];
                        }
                    });
                }); };
                makeSourceCode = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, makeDirAsync('src')];
                            case 1:
                                _a.sent();
                                return [4, makeFileAsync('src/index.ts')];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                }); };
                operations.push(managePackages());
                operations.push(makeFileAsync('README.md'));
                operations.push(makeSourceCode());
                operations.push(makeFileAsync('.gitignore'));
                return [4, Promise.all(operations)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4, runCommand('git init')];
            case 3:
                _a.sent();
                return [3, 5];
            case 4: return [7];
            case 5:
                console.log('setup complete. happy coding! :)');
                return [3, 7];
            case 6:
                err_1 = _a.sent();
                console.log('oops... something went wrong:');
                console.log(err_1);
                return [3, 7];
            case 7: return [2];
        }
    });
}); };
runSetup();
//# sourceMappingURL=index.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const minimist_1 = __importDefault(require("minimist"));
const gm_1 = __importDefault(require("gm"));
const index_1 = require("../index");
const args = minimist_1.default(process.argv.slice(2));
if (args._.length < 2) {
    console.error(`Usage: ${process.argv[0]} <image file> <build file>`);
    process.exit(1);
}
const imageFilePath = path_1.default.resolve(args._[0]);
const buildFilePath = path_1.default.resolve(args._[1]);
const imageBuf = fs_1.readFileSync(imageFilePath);
const build = loadBuildFile(buildFilePath);
console.log(`Loaded ${build.symbols.length} symbols.`);
extractSprites(build)
    .then(() => {
    console.log("Done.");
    process.exit(0);
})
    .catch(err => {
    console.error(err);
    process.exit(1);
});
function extractSprites(build) {
    return __awaiter(this, void 0, void 0, function* () {
        const size = yield getImageSize(imageFilePath);
        for (const symbol of build.symbols) {
            yield extractSymbol(symbol, size);
        }
    });
}
function extractSymbol(symbol, size) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = symbol.decodedName || `0x${symbol.hash}`;
        console.log(`Extracting symbol ${name}`);
        fs_1.mkdirSync(name);
        for (const frame of symbol.frames) {
            yield extractFrame(name, frame, size);
        }
    });
}
function getImageSize(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((accept, reject) => {
            gm_1.default(path).size((err, size) => {
                if (err)
                    reject(err);
                else
                    accept(size);
            });
        });
    });
}
function extractFrame(name, frame, size) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`--Extracting frame ${frame.frameNum}`);
        /*
             frame.x1 * ImageW, (1 - frame.y1) * ImageH, frame.x2 * ImageW, (1 - frame.y2) * ImageH, (frame.x2 - frame.x1) * ImageW, (frame.y2 - frame.y1) * ImageH,
        */
        const x = frame.uvMin.x * size.width;
        const y = (1 - frame.uvMin.y) * size.height;
        const width = (frame.uvMax.x - frame.uvMin.x) * size.width;
        const height = (1 - frame.uvMax.y - (1 - frame.uvMin.y)) * size.height;
        console.log(`--Frame is ${x}, ${y} ${width}x${height}`);
        return new Promise((accept, reject) => {
            gm_1.default(imageFilePath)
                .crop(width, height, x, y)
                .write(path_1.default.join(path_1.default.dirname(imageFilePath), name, `${name}_${frame.frameNum}.png`), err => (err ? reject(err) : accept()));
        });
    });
}
function loadBuildFile(filePath) {
    const buildData = fs_1.readFileSync(filePath);
    const build = index_1.parseKBuild(buildData.buffer);
    return build;
}
//# sourceMappingURL=oni-kanim-parser.js.map
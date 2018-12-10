"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../../parser");
const parser_2 = require("./frame/parser");
function* parseKAnimBuildSymbol(version) {
    const hash = yield parser_1.readInt32();
    const path = version > 9 ? yield parser_1.readInt32() : null;
    const colourChannel = yield parser_1.readInt32();
    const flags = yield parser_1.readInt32();
    const numFrames = yield parser_1.readInt32();
    const frames = new Array(numFrames);
    for (let i = 0; i < numFrames; i++) {
        const frame = yield* parser_2.parseKAnimBuildSymbolFrame();
        frames[i] = frame;
    }
    const symbol = {
        hash,
        path,
        colourChannel,
        flags,
        frames
    };
    return symbol;
}
exports.parseKAnimBuildSymbol = parseKAnimBuildSymbol;
function* unparseKAnimBuildSymbol(symbol, version) {
    const { hash, path, colourChannel, flags, frames } = symbol;
    yield parser_1.writeInt32(hash);
    if (version > 9) {
        yield parser_1.writeInt32(path || 0);
    }
    yield parser_1.writeInt32(colourChannel);
    yield parser_1.writeInt32(flags);
    yield parser_1.writeInt32(frames.length);
    for (const frame of frames) {
        yield* parser_2.unparseKAnimBuildSymbolFrame(frame);
    }
}
exports.unparseKAnimBuildSymbol = unparseKAnimBuildSymbol;
//# sourceMappingURL=parser.js.map
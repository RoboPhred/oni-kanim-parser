"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../../../parser");
function* parseKAnimBuildSymbolFrame() {
    const frameNum = yield parser_1.readInt32();
    const duration = yield parser_1.readInt32();
    // symbolFrameInstance.buildImageIdx = data.textureStartIndex[fileNameHash] + reader.ReadInt32();
    const imageIndex = yield parser_1.readInt32();
    const originX = yield parser_1.readSingle();
    const originY = yield parser_1.readSingle();
    const width = yield parser_1.readSingle();
    const height = yield parser_1.readSingle();
    const uvMinX = yield parser_1.readSingle();
    const uvMinY = 1 - (yield parser_1.readSingle());
    const uvMaxX = yield parser_1.readSingle();
    const uvMaxY = 1 - (yield parser_1.readSingle());
    const frame = {
        frameNum,
        duration,
        imageIndex,
        origin: { x: originX, y: originY },
        width,
        height,
        uvMin: { x: uvMinX, y: uvMinY },
        uvMax: { x: uvMaxX, y: uvMaxY }
    };
    return frame;
}
exports.parseKAnimBuildSymbolFrame = parseKAnimBuildSymbolFrame;
function* unparseKAnimBuildSymbolFrame(frame) {
    const { frameNum, duration, imageIndex, origin, width, height, uvMin, uvMax } = frame;
    yield parser_1.writeInt32(frameNum);
    yield parser_1.writeInt32(duration);
    yield parser_1.writeInt32(imageIndex);
    yield parser_1.writeSingle(origin.x);
    yield parser_1.writeSingle(origin.y);
    yield parser_1.writeSingle(width);
    yield parser_1.writeSingle(height);
    yield parser_1.writeSingle(uvMin.x);
    yield parser_1.writeSingle(1 - uvMin.y);
    yield parser_1.writeSingle(uvMax.x);
    yield parser_1.writeSingle(1 - uvMax.y);
}
exports.unparseKAnimBuildSymbolFrame = unparseKAnimBuildSymbolFrame;
//# sourceMappingURL=parser.js.map
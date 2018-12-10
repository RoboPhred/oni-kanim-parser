"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_serializer_1 = require("./binary-serializer");
const parser_1 = require("./parser");
const parser_2 = require("./build-structure/parser");
var progress_1 = require("./progress");
exports.progressReporter = progress_1.progressReporter;
var tagger_1 = require("./tagger");
exports.tagReporter = tagger_1.tagReporter;
function parseKBuild(data, interceptor) {
    let reader = new binary_serializer_1.ArrayDataReader(data);
    const saveGame = parser_1.parse(reader, parser_2.parseKAnimBuild(), interceptor);
    return saveGame;
}
exports.parseKBuild = parseKBuild;
function writeKBuild(save, interceptor) {
    const writer = new binary_serializer_1.ArrayDataWriter();
    parser_1.unparse(writer, parser_2.unparseKAnimBuild(save), interceptor);
    return writer.getBytes();
}
exports.writeKBuild = writeKBuild;
//# sourceMappingURL=index.js.map
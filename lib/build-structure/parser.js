"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../parser");
const parser_2 = require("./symbol/parser");
const KBUILD_HEADER = "BILD";
const VERSIONS = [9, 10];
function* parseKAnimBuild() {
    const header = yield parser_1.readChars(KBUILD_HEADER.length);
    if (header !== KBUILD_HEADER) {
        throw new Error(`Failed to parse kbuild header: Expected "${KBUILD_HEADER}" but got "${header}" (${Array.from(header).map(x => x.charCodeAt(0))})`);
    }
    const version = yield parser_1.readInt32();
    if (!VERSIONS.includes(version)) {
        throw new Error(`Failed to parse kbuild: Unknown version ${version}.  Expected ${VERSIONS.join(", ")}.`);
    }
    const symbolCount = yield parser_1.readInt32();
    const frameCount = yield parser_1.readInt32();
    const name = yield parser_1.readKleiString();
    const symbols = new Array(symbolCount);
    for (let i = 0; i < symbolCount; i++) {
        const symbol = yield* parser_2.parseKAnimBuildSymbol(version);
        symbols[i] = symbol;
    }
    const hashCount = yield parser_1.readInt32();
    const hashTable = new Array(hashCount);
    for (let i = 0; i < hashCount; i++) {
        const hash = yield parser_1.readInt32();
        const value = yield parser_1.readKleiString();
        hashTable[i] = {
            hash,
            value
        };
    }
    for (const symbol of symbols) {
        const { hash } = symbol;
        const entry = hashTable.find(x => x.hash === hash);
        if (entry) {
            symbol.decodedName = entry.value;
        }
    }
    const build = {
        version,
        frameCount,
        name,
        symbols,
        hashTable
    };
    return build;
}
exports.parseKAnimBuild = parseKAnimBuild;
function* unparseKAnimBuild(build) {
    const { version, symbols, frameCount, name, hashTable } = build;
    yield parser_1.writeChars(KBUILD_HEADER);
    yield parser_1.writeInt32(version);
    yield parser_1.writeInt32(symbols.length);
    yield parser_1.writeInt32(frameCount);
    yield parser_1.writeKleiString(name);
    for (const symbol of symbols) {
        yield* parser_2.unparseKAnimBuildSymbol(symbol, version);
    }
    yield parser_1.writeInt32(hashTable.length);
    for (const entry of hashTable) {
        yield parser_1.writeInt32(entry.hash);
        yield parser_1.writeKleiString(entry.value);
    }
}
exports.unparseKAnimBuild = unparseKAnimBuild;
//# sourceMappingURL=parser.js.map
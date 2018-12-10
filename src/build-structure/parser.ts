import {
  ParseIterator,
  UnparseIterator,
  readChars,
  readInt32,
  readKleiString,
  writeChars,
  writeInt32,
  writeKleiString
} from "../parser";

import { KAnimBuild, HashTableEntry } from "./KAnimBuild";

import { KAnimBuildSymbol } from "./symbol";
import {
  parseKAnimBuildSymbol,
  unparseKAnimBuildSymbol
} from "./symbol/parser";

const KBUILD_HEADER = "BILD";

const VERSIONS = [9, 10];

export function* parseKAnimBuild(): ParseIterator<KAnimBuild> {
  const header: string = yield readChars(KBUILD_HEADER.length);
  if (header !== KBUILD_HEADER) {
    throw new Error(
      `Failed to parse kbuild header: Expected "${KBUILD_HEADER}" but got "${header}" (${Array.from(
        header
      ).map(x => x.charCodeAt(0))})`
    );
  }

  const version: number = yield readInt32();
  if (!VERSIONS.includes(version)) {
    throw new Error(
      `Failed to parse kbuild: Unknown version ${version}.  Expected ${VERSIONS.join(
        ", "
      )}.`
    );
  }

  const symbolCount: number = yield readInt32();
  const frameCount: number = yield readInt32();
  const name: string = yield readKleiString();

  const symbols: KAnimBuildSymbol[] = new Array(symbolCount);
  for (let i = 0; i < symbolCount; i++) {
    const symbol: KAnimBuildSymbol = yield* parseKAnimBuildSymbol(version);
    symbols[i] = symbol;
  }

  const hashCount: number = yield readInt32();
  const hashTable: HashTableEntry[] = new Array(hashCount);
  for (let i = 0; i < hashCount; i++) {
    const hash = yield readInt32();
    const value = yield readKleiString();
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

  const build: KAnimBuild = {
    version,
    frameCount,
    name,
    symbols,
    hashTable
  };
  return build;
}

export function* unparseKAnimBuild(build: KAnimBuild): UnparseIterator {
  const { version, symbols, frameCount, name, hashTable } = build;

  yield writeChars(KBUILD_HEADER);
  yield writeInt32(version);

  yield writeInt32(symbols.length);
  yield writeInt32(frameCount);
  yield writeKleiString(name);

  for (const symbol of symbols) {
    yield* unparseKAnimBuildSymbol(symbol, version);
  }

  yield writeInt32(hashTable.length);
  for (const entry of hashTable) {
    yield writeInt32(entry.hash);
    yield writeKleiString(entry.value);
  }
}

import {
  ParseIterator,
  readInt32,
  UnparseIterator,
  writeInt32
} from "../../parser";

import { KAnimBuildSymbolFrame } from "./frame/KAnimBuildSymbolFrame";
import {
  parseKAnimBuildSymbolFrame,
  unparseKAnimBuildSymbolFrame
} from "./frame/parser";

import { KAnimBuildSymbol } from "./KAnimBuildSymbol";

export function* parseKAnimBuildSymbol(
  version: number
): ParseIterator<KAnimBuildSymbol> {
  const hash: number = yield readInt32();
  const path: number | null = version > 9 ? yield readInt32() : null;
  const colourChannel: number = yield readInt32();
  const flags: number = yield readInt32();

  const numFrames = yield readInt32();
  const frames: KAnimBuildSymbolFrame[] = new Array(numFrames);
  for (let i = 0; i < numFrames; i++) {
    const frame = yield* parseKAnimBuildSymbolFrame();
    frames[i] = frame;
  }

  const symbol: KAnimBuildSymbol = {
    hash,
    path,
    colourChannel,
    flags,
    frames
  };

  return symbol;
}

export function* unparseKAnimBuildSymbol(
  symbol: KAnimBuildSymbol,
  version: number
): UnparseIterator {
  const { hash, path, colourChannel, flags, frames } = symbol;

  yield writeInt32(hash);
  if (version > 9) {
    yield writeInt32(path || 0);
  }
  yield writeInt32(colourChannel);
  yield writeInt32(flags);

  yield writeInt32(frames.length);
  for (const frame of frames) {
    yield* unparseKAnimBuildSymbolFrame(frame);
  }
}

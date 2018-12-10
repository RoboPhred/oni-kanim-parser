import {
  ParseIterator,
  readInt32,
  readSingle,
  UnparseIterator,
  writeInt32,
  writeSingle
} from "../../../parser";

import { KAnimBuildSymbolFrame } from "./KAnimBuildSymbolFrame";

export function* parseKAnimBuildSymbolFrame(): ParseIterator<
  KAnimBuildSymbolFrame
> {
  const frameNum: number = yield readInt32();
  const duration: number = yield readInt32();

  // symbolFrameInstance.buildImageIdx = data.textureStartIndex[fileNameHash] + reader.ReadInt32();
  const imageIndex: number = yield readInt32();

  const originX: number = yield readSingle();
  const originY: number = yield readSingle();

  const width: number = yield readSingle();
  const height: number = yield readSingle();

  const uvMinX: number = yield readSingle();
  const uvMinY: number = 1 - (yield readSingle());
  const uvMaxX: number = yield readSingle();
  const uvMaxY: number = 1 - (yield readSingle());

  const frame: KAnimBuildSymbolFrame = {
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

export function* unparseKAnimBuildSymbolFrame(
  frame: KAnimBuildSymbolFrame
): UnparseIterator {
  const {
    frameNum,
    duration,
    imageIndex,
    origin,
    width,
    height,
    uvMin,
    uvMax
  } = frame;

  yield writeInt32(frameNum);
  yield writeInt32(duration);
  yield writeInt32(imageIndex);

  yield writeSingle(origin.x);
  yield writeSingle(origin.y);
  yield writeSingle(width);
  yield writeSingle(height);

  yield writeSingle(uvMin.x);
  yield writeSingle(1 - uvMin.y);

  yield writeSingle(uvMax.x);
  yield writeSingle(1 - uvMax.y);
}

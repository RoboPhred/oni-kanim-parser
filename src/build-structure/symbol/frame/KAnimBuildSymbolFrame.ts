import { Vector2 } from "../../../types";

export interface KAnimBuildSymbolFrame {
  frameNum: number;
  duration: number;
  imageIndex: number; // symbolFrameInstance.buildImageIdx = data.textureStartIndex[fileNameHash] + reader.ReadInt32();
  origin: Vector2;
  width: number;
  height: number;
  uvMin: Vector2;
  uvMax: Vector2;
}

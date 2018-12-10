import { KAnimBuildSymbolFrame } from "./frame/KAnimBuildSymbolFrame";

export interface KAnimBuildSymbol {
  hash: number;
  decodedName?: string;
  path: number | null;
  colourChannel: number;
  flags: number;
  frames: KAnimBuildSymbolFrame[];
}

import { KAnimBuildSymbol } from "./symbol";

export interface KAnimBuild {
  version: number;
  frameCount: number;
  name: string;
  symbols: KAnimBuildSymbol[];
  hashTable: HashTableEntry[];
}

export interface HashTableEntry {
  hash: number;
  value: string;
}

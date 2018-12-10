import { ParseIterator, UnparseIterator } from "../../parser";
import { KAnimBuildSymbol } from "./KAnimBuildSymbol";
export declare function parseKAnimBuildSymbol(version: number): ParseIterator<KAnimBuildSymbol>;
export declare function unparseKAnimBuildSymbol(symbol: KAnimBuildSymbol, version: number): UnparseIterator;

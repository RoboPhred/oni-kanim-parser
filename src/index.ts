import { ArrayDataReader, ArrayDataWriter } from "./binary-serializer";

import { parse, unparse, ParseInterceptor, UnparseInterceptor } from "./parser";

import { KAnimBuild } from "./build-structure";
import { parseKAnimBuild, unparseKAnimBuild } from "./build-structure/parser";

export { progressReporter } from "./progress";
export { tagReporter } from "./tagger";

export function parseKBuild(
  data: ArrayBuffer,
  interceptor?: ParseInterceptor
): KAnimBuild {
  let reader = new ArrayDataReader(data);
  const saveGame = parse<KAnimBuild>(reader, parseKAnimBuild(), interceptor);
  return saveGame;
}

export function writeKBuild(
  save: KAnimBuild,
  interceptor?: UnparseInterceptor
): ArrayBuffer {
  const writer = new ArrayDataWriter();
  unparse<KAnimBuild>(writer, unparseKAnimBuild(save), interceptor);
  return writer.getBytes();
}

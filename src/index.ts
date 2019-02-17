import { ArrayDataReader, ArrayDataWriter } from "./binary-serializer";

import { parse, unparse, ParseInterceptor, UnparseInterceptor } from "./parser";

import { KAnimBuild } from "./build-structure";
import { parseKAnimBuild, unparseKAnimBuild } from "./build-structure/parser";

export { progressReporter } from "./progress";
export { tagReporter } from "./tagger";

export * from "./build-structure";

export function parseKBuild(
  data: ArrayBuffer,
  interceptor?: ParseInterceptor
): KAnimBuild {
  let reader = new ArrayDataReader(data);
  const kBuild = parse<KAnimBuild>(reader, parseKAnimBuild(), interceptor);
  return kBuild;
}

export function writeKBuild(
  kBuild: KAnimBuild,
  interceptor?: UnparseInterceptor
): ArrayBuffer {
  const writer = new ArrayDataWriter();
  unparse<KAnimBuild>(writer, unparseKAnimBuild(kBuild), interceptor);
  return writer.getBytes();
}

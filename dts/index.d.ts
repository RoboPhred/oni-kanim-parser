import { ParseInterceptor, UnparseInterceptor } from "./parser";
import { KAnimBuild } from "./build-structure";
export { progressReporter } from "./progress";
export { tagReporter } from "./tagger";
export * from "./build-structure";
export declare function parseKBuild(data: ArrayBuffer, interceptor?: ParseInterceptor): KAnimBuild;
export declare function writeKBuild(save: KAnimBuild, interceptor?: UnparseInterceptor): ArrayBuffer;

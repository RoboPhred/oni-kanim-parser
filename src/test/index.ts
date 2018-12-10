import { readFileSync, writeFileSync } from "fs";

import compose from "lodash.flowright";

import { diff } from "deep-diff";

import {
  parseKBuild,
  writeKBuild,
  progressReporter,
  tagReporter
} from "../index";
import { KAnimBuild } from "../build-structure";

import minimist from "minimist";

const currentTagPath: string[] = [];

const args = minimist(process.argv.slice(2), {
  boolean: ["progress", "progress-tags"]
});

const showProgress = args.progress;
const showTags = args["progress-tags"];

const fileName = args._[0];

console.log("Loading kbuild");
const kbuild = loadFile(fileName);

console.log("Detected symbols:");
for (const symbol of kbuild.symbols) {
  const { hash } = symbol;
  const entry = kbuild.hashTable.find(x => x.hash === hash);
  console.log(
    `Found ${entry ? entry.value : "UNKNOWN"} with ${
      symbol.frames.length
    } frames`
  );
}

writeFileSync(`./test-data/${fileName}.json`, JSON.stringify(kbuild, null, 2));

console.log("re-saving");
const writebackName = `${fileName}-writeback`;
saveFile(writebackName, kbuild);

console.log("reloading");
const writebackData = loadFile(writebackName);

console.log("diffing");
const writebackDiff = checkDiff(kbuild, writebackData);

console.log("changes:", writebackDiff && writebackDiff.length);
if (writebackDiff) {
  console.dir(writebackDiff);
}

console.log("done");

function checkDiff(original: KAnimBuild, modified: KAnimBuild) {
  return diff(original, modified);
}

function loadFile(fileName: string): KAnimBuild {
  const fileData = readFileSync(`./test-data/${fileName}`);

  let interceptors = [];

  if (showProgress) {
    interceptors.push(progressReporter(console.log.bind(console, "LOADING")));
  }
  if (showTags) {
    interceptors.push(
      tagReporter(
        console.log.bind(console, "LOAD-TAG-START"),
        console.log.bind(console, "LOAD-TAG-END")
      )
    );
  }

  const interceptor = (compose as any)((x: any) => x, ...interceptors);

  try {
    return parseKBuild(fileData.buffer, interceptor);
  } catch (e) {
    console.error(`Load error at ${currentTagPath.join(" => ")}`);
    e.tagPath = [...currentTagPath];
    throw e;
  }
}

function saveFile(fileName: string, build: KAnimBuild) {
  let interceptors = [];

  if (showProgress) {
    interceptors.push(progressReporter(console.log.bind(console, "SAVING")));
  }

  interceptors.push(tagReporter(onTagStart, onTagEnd));

  const interceptor = (compose as any)((x: any) => x, ...interceptors);

  try {
    const fileData = writeKBuild(build, interceptor);
    writeFileSync(`./test-data/${fileName}`, new Uint8Array(fileData));
  } catch (e) {
    console.error(`Save error at ${currentTagPath.join(" => ")}`);
    e.tagPath = [...currentTagPath];
    throw e;
  }
}

function onTagStart(tagName: string, instanceName: string | null) {
  if (showTags) {
    console.log("TAG_START", tagName, instanceName);
  }
  const part = instanceName ? `${tagName}::${instanceName}` : tagName;
  currentTagPath.push(part);
}
function onTagEnd(tagName: string, instanceName: string | null) {
  if (showTags) {
    console.log("TAG_END", tagName, instanceName);
  }

  const part = instanceName ? `${tagName}::${instanceName}` : tagName;
  if (currentTagPath[currentTagPath.length - 1] !== part) {
    debugger;
  }
  currentTagPath.pop();
}

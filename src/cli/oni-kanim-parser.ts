import { readFileSync, mkdirSync, writeFileSync } from "fs";

import path from "path";

import minimist from "minimist";

import gm from "gm";

import { parseKBuild } from "../index";
import { KAnimBuild } from "../build-structure";
import { KAnimBuildSymbol } from "../build-structure/symbol";
import { KAnimBuildSymbolFrame } from "../build-structure/symbol/frame/KAnimBuildSymbolFrame";

const args = minimist(process.argv.slice(2));

if (args._.length < 2) {
  console.error(`Usage: ${process.argv[0]} <image file> <build file>`);
  process.exit(1);
}

const imageFilePath = path.resolve(args._[0]);
const buildFilePath = path.resolve(args._[1]);

const build = loadBuildFile(buildFilePath);

console.log(`Loaded ${build.symbols.length} symbols.`);
writeFileSync(`${buildFilePath}.json`, JSON.stringify(build, null, 2));
extractSprites(build)
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function extractSprites(build: KAnimBuild) {
  const size = await getImageSize(imageFilePath);
  for (const symbol of build.symbols) {
    await extractSymbol(symbol, size);
  }
}

async function extractSymbol(symbol: KAnimBuildSymbol, size: gm.Dimensions) {
  const name = symbol.decodedName || `0x${symbol.hash}`;
  console.log(`Extracting symbol ${name}`);
  mkdirSync(name);
  for (const frame of symbol.frames) {
    await extractFrame(name, frame, size);
  }
}

async function getImageSize(path: string): Promise<gm.Dimensions> {
  return new Promise<gm.Dimensions>((accept, reject) => {
    gm(path).size((err, size) => {
      if (err) reject(err);
      else accept(size);
    });
  });
}

async function extractFrame(
  name: string,
  frame: KAnimBuildSymbolFrame,
  size: gm.Dimensions
) {
  console.log(`--Extracting frame ${frame.frameNum}`);
  /*
       frame.x1 * ImageW, (1 - frame.y1) * ImageH, frame.x2 * ImageW, (1 - frame.y2) * ImageH, (frame.x2 - frame.x1) * ImageW, (frame.y2 - frame.y1) * ImageH,
  */
  const x = frame.uvMin.x * size.width;
  const y = (1 - frame.uvMin.y) * size.height;
  const width = (frame.uvMax.x - frame.uvMin.x) * size.width;
  const height = (1 - frame.uvMax.y - (1 - frame.uvMin.y)) * size.height;
  console.log(`--Frame is ${x}, ${y} ${width}x${height}`);
  return new Promise((accept, reject) => {
    gm(imageFilePath)
      .crop(width, height, x, y)
      .write(
        path.join(
          path.dirname(imageFilePath),
          name,
          `${name}_${frame.frameNum}.png`
        ),
        err => (err ? reject(err) : accept())
      );
  });
}

function loadBuildFile(filePath: string): KAnimBuild {
  const buildData = readFileSync(filePath);
  const build = parseKBuild(buildData.buffer);
  return build;
}

# oni-kanim-parser

This library provides paring for Klei KAnim TextAssets from Oxygen Not Included.

These files come in two varieties: build and anim.

- Build files contain the information of how to extract sprites and their frames from a sprite sheet.
- Anim files I have yet to look into, but probably how to animate a sprite.

Despite the TextAsset designation, these files are serialized in a custom non-text format.

# CLI

This packages includes a command line tool for extracting sprites given a sprite image and a build file.
This tool relies on [GraphicsMagic](http://www.graphicsmagick.org/) to do the heavy lifting, which must be
installed to make use of the cli. This tool is optional if you do not intend to run the build in cli tool.

Invoking this tool will split the image into individual folders of frames, spewing the result in the current
working directory.

## Usage

```bash
oni-kanim-parser <image file> <build file>
```

# API

## `parseKBuild(data: ArrayBuffer): KAnimBuild`

Parse a kbuild file from an array buffer.
Returns the parsed object.

## `writeKBuild(build: KAnimBuild): ArrayBuffer`

Writes a parsed kbuild object back into raw data for the TextAsset

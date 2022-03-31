const StyleDictionary = require("style-dictionary");
const JsonSetsFormatter = require("../index").JsonSetsFormatter;
const helpers = require("./helpers");

const fs = require("fs");
const path = require("path");

StyleDictionary.registerFormat(JsonSetsFormatter);

const generateConfig = (filename) => {
  return {
    source: [`tests/fixtures/${filename}`],
    platforms: {
      JSON: {
        buildPath: helpers.outputDir,
        transforms: ["attribute/cti", "name/cti/kebab"],
        files: [
          {
            destination: filename,
            format: "json/sets",
            options: {
              showFileHeader: false,
              outputReferences: true,
            },
          },
        ],
      },
    },
  };
};

beforeEach(() => {
  helpers.clearOutput();
});

afterEach(() => {
  helpers.clearOutput();
});

test("a ref pointing to a set should include all values", () => {
  const filename = "set-in-ref.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

test("a ref that points to additional refs should resolve", () => {
  const filename = "multi-ref.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

test("should handle multi nested values", () => {
  const filename = "multi-depth.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

test("should exclude set values when config set", () => {
  const filename = "exclusive-set.json";
  const config = generateConfig(filename);
  config.platforms.JSON.files[0].options = {
    ...config.platforms.JSON.files[0].options,
    ...{ set: "express" },
  };
  const sd = StyleDictionary.extend(config);
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

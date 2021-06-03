#!/usr/bin/env zx

const { readdirSync, readFileSync } = require("fs");
const { writeFileSync } = require("node:fs");
const { join } = require("path");
const jsonformat = require("json-format");
const YAML = require("yaml");

let applications = [];

$`rm -rf ./data`;
$`mkdir ./data`;

const readManifest = (path) => {
  try {
    const content = readFileSync(path, "utf8");
    const jsonContent = YAML.parse(content);
    return { ...jsonContent, versions: [] };
  } catch (e) {
    console.error(e);
    return null;
  }
};

const manifestFolders = readdirSync(
  join(__dirname, "../tmp/archive/manifests")
);

manifestFolders.forEach((folder) => {
  const devs = readdirSync(
    join(__dirname, `../tmp/archive/manifests/${folder}`)
  );

  devs.forEach((dev) => {
    const apps = readdirSync(
      join(__dirname, `../tmp/archive/manifests/${folder}/${dev}`)
    );

    apps.forEach((app) => {
      const versions = readdirSync(
        join(__dirname, `../tmp/archive/manifests/${folder}/${dev}/${app}`)
      );

      // read manifest of latest version
      const lastVersion = versions[versions.length - 1];
      const manifest = readManifest(
        join(
          __dirname,
          `../tmp/archive/manifests/${folder}/${dev}/${app}/${lastVersion}/${dev}.${app}.yaml`
        )
      );

      if (manifest) {
        versions.forEach((version) => {
          const versionManifest = readManifest(
            join(
              __dirname,
              `../tmp/archive/manifests/${folder}/${dev}/${app}/${version}/${dev}.${app}.yaml`
            )
          );

          manifest.versions.push(versionManifest);
        });

        applications.push(manifest);
      }
    });
  });
});

$`rm -rf ./data/db.json`;
writeFileSync(join(__dirname, "../data/db.json"), jsonformat(applications));

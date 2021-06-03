#!/usr/bin/env zx

const { readdirSync, readFileSync, existsSync } = require("fs");
const { writeFileSync } = require("node:fs");
const { join } = require("path");
const jsonformat = require("json-format");
const YAML = require("yaml");

let applications = [];

$`rm -rf ./data`;
$`mkdir ./data`;

const getManifestContent = (path) => {
  const content = readFileSync(path, "utf8");
  return YAML.parse(content);
};

const readManifest = (path, moniker) => {
  try {
    let jsonContent = getManifestContent(path + `/${moniker}.yaml`);

    if (existsSync(path + `/${moniker}.installer.yaml`)) {
      const installerContent = getManifestContent(
        path + `/${moniker}.installer.yaml`
      );
      jsonContent = { ...jsonContent, ...installerContent };
    }

    if (existsSync(path + `/${moniker}.locale.en-US.yaml`)) {
      const localeContent = getManifestContent(
        path + `/${moniker}.locale.en-US.yaml`
      );
      jsonContent = { ...jsonContent, ...localeContent };
    }

    return jsonContent;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const readParentManifest = (path, moniker) => {
  const manifest = readManifest(path, moniker);
  return { ...manifest, versions: [] };
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
      const manifest = readParentManifest(
        join(
          __dirname,
          `../tmp/archive/manifests/${folder}/${dev}/${app}/${lastVersion}`
        ),
        `${dev}.${app}`
      );

      if (manifest) {
        versions.forEach((version) => {
          const versionManifest = readManifest(
            join(
              __dirname,
              `../tmp/archive/manifests/${folder}/${dev}/${app}/${version}`
            ),
            `${dev}.${app}`
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

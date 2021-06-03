#!/usr/bin/env zx

const GITHUB_REPOSITORY_NAME = "winget-pkgs";
const GITHUB_REPOSITORY_USER = "microsoft";

const TAR_URL = `https://github.com/${GITHUB_REPOSITORY_USER}/${GITHUB_REPOSITORY_NAME}/archive/master.tar.gz`;

// download file
await $`rm -rf ./tmp && mkdir ./tmp`;
await $`wget -O ./tmp/archive.tar.gz ${TAR_URL}`;
await $`tar -xvf ./tmp/archive.tar.gz && mv ./winget-pkgs-master ./tmp/archive`;

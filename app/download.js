#!/usr/bin/env zx

const GITHUB_REPOSITORY_NAME = "winget-pkgs";
const GITHUB_REPOSITORY_USER = "microsoft";

const TAR_URL = `https://github.com/${GITHUB_REPOSITORY_USER}/${GITHUB_REPOSITORY_NAME}/archive/master.tar.gz`;

// download file
await $`rm -rf ./tmp && mkdir ./tmp`;
await $`curl -L ${TAR_URL} -o ./tmp/archive.tar.gz`;
await $`tar -xvf ./tmp/archive.tar.gz && mv ./winget-pkgs-master ./tmp/archive`;

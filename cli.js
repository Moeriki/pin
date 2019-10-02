#!/usr/bin/env node

const { execSync } = require('child_process');
const { promises: fs } = require('fs');

const { constant } = require('lodash/fp');

const voltaHome = process.env.VOLTA_HOME;
if (!voltaHome) {
  console.error('volta not found');
  process.exit(1);
}
const voltaBin = `${voltaHome}/volta`;

const readFile = (filepath) => fs.readFile(filepath, { encoding: 'utf8' });

(async () => {
  const [engines, nvmVersion] = await Promise.all([
    readFile('package.json')
      .then(JSON.parse)
      .then((pkg) => pkg.engines || {})
      .catch(constant(null)),
    readFile('.nvmrc')
      .then((str) => str.split('\n')[0].trim())
      .catch(constant(null))
  ]);
  const nodeVersion = nvmVersion || engines.node;
  // const npmVersion = engines.npm;
  if (nodeVersion) {
    execSync(`${voltaBin} pin node@${nodeVersion}`);
  }
  // if (npmVersion) {
  //   execSync(`${voltaBin} pin npm@${npmVersion}`);
  // }
  execSync(`${voltaBin} pin yarn`);
})();

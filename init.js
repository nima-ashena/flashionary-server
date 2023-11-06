const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules

// const output = execSync('ls', { encoding: 'utf-8' });  // the default is 'buffer'
// console.log('Output was:\n', output);

execSync('cp .env.example .env');
execSync('cp deploy.sh.example deploy.sh');

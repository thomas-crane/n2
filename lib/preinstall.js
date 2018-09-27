const fs = require('fs')
const path = require('path');
const spawn = require('child_process').spawn;
const os = require('os');

const modulePath = path.join(__dirname, '..', 'modules');

const dirs = fs.readdirSync(modulePath);
for (const dir of dirs) {
  const module = path.join(modulePath, dir);
  if (!fs.existsSync(path.join(module, 'package.json'))) {
    return;
  }

  const cmd = os.platform() === 'win32' ? 'npm.cmd' : 'npm';

  console.log(`running npm install in modules/${dir}`);
  spawn(cmd, ['install'], { env: process.env, cwd: module, stdio: 'ignore' }).once('exit', () => {
    console.log(`install finished in modules/${dir}`);
  });
}

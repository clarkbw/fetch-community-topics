import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_URL'] = 'https://github.community/';
  process.env['INPUT_SLUG'] = 'github-packages/43';
  process.env['INPUT_UNANSWERED'] = 'true';
  process.env['INPUT_PINNED'] = 'true';
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecSyncOptions = {
    env: process.env
  };
  console.log(cp.execSync(`node ${ip}`, options).toString());
});

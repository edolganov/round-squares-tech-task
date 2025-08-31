import * as fs from 'node:fs';

async function init() {
  const result = await (
    await fetch('http://localhost:3000/docs.json?' + Date.now())
  ).json();

  fs.writeFileSync(
    './config/api/api.json',
    JSON.stringify(result, null, 2),
    'utf-8',
  );

  console.log('Update api file done');

  fs.rmSync('./src/generated/api', { recursive: true, force: true });

  console.log('Old generated dir removed');
}

init().catch(console.error);

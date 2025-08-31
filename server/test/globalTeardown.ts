import { TestCtx } from './common';

export default async (): Promise<void> => {
  console.log('🔌 Stopping db...');

  await TestCtx.pgClient.end();
  await TestCtx.container.stop();

  console.log('✅ Db stopped successfully');
};

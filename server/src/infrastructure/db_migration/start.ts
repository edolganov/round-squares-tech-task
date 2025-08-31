import { processMigration } from './processMigration';

processMigration({ showLogs: true, makeDbData: true }).catch(console.error);

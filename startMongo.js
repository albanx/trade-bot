import { execSync, spawnSync } from 'child_process';
import env from './env';
const MONGO_EXE = 'C:/projects/mongodb/mongod.exe';
const command = `${MONGO_EXE} -dbpath=${env.MONGO_DB_PATH}`;

console.log(`Starting MongoD...${command}`);
spawnSync(command, {
  stdio: 'inherit'
});

import * as migration_20260124_024426 from './20260124_024426';
import * as migration_20260124_215620 from './20260124_215620';

export const migrations = [
  {
    up: migration_20260124_024426.up,
    down: migration_20260124_024426.down,
    name: '20260124_024426',
  },
  {
    up: migration_20260124_215620.up,
    down: migration_20260124_215620.down,
    name: '20260124_215620'
  },
];

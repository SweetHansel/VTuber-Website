import * as migration_20260202_095301 from './20260202_095301';

export const migrations = [
  {
    up: migration_20260202_095301.up,
    down: migration_20260202_095301.down,
    name: '20260202_095301'
  },
];

import * as migration_20261123_140421_initial from "./20261123_140421_initial";

export const migrations = [
  {
    up: migration_20261123_140421_initial.up,
    down: migration_20261123_140421_initial.down,
    name: "20261123_140421_initial",
  },
];

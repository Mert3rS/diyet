import * as migration_20261123_140421_initial from "./20261123_140421_initial";
import * as migration_20261123_193333_hosted_media from "./20261123_193333_hosted_media";
import * as migration_20261123_193334_cms_row_security from "./20261123_193334_cms_row_security";

export const migrations = [
  {
    up: migration_20261123_140421_initial.up,
    down: migration_20261123_140421_initial.down,
    name: "20261123_140421_initial",
  },
  {
    up: migration_20261123_193333_hosted_media.up,
    down: migration_20261123_193333_hosted_media.down,
    name: "20261123_193333_hosted_media",
  },
  {
    up: migration_20261123_193334_cms_row_security.up,
    down: migration_20261123_193334_cms_row_security.down,
    name: "20261123_193334_cms_row_security",
  },
];

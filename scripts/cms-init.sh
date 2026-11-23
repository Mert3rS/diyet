#!/bin/sh
set -eu
npm run cms:migrate
npm run cms:seed

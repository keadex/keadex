SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"

yarn nx build mina-live --skip-nx-cache

rm -rf $SCRIPT_PATH/apps/keadex-battisti/.next

rm -rf $SCRIPT_PATH/node_modules/@keadex/mina-live-npm/*

cp -R $SCRIPT_PATH/libs/mina-live/dist/* $SCRIPT_PATH/node_modules/@keadex/mina-live-npm

yarn nx serve keadex-battisti --skip-nx-cache
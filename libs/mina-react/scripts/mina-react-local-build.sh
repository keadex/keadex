SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"

yarn nx build mina-react --skip-nx-cache

rm -rf $SCRIPT_PATH/apps/keadex-battisti/.next

rm -rf $SCRIPT_PATH/node_modules/@keadex/mina-react-npm/*

cp -R $SCRIPT_PATH/libs/mina-react/dist/* $SCRIPT_PATH/node_modules/@keadex/mina-react-npm

yarn nx serve keadex-battisti --skip-nx-cache

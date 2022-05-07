# Name of the app to check.
APP=$APP_TO_CHECK

# Determine version of Nx installed
NX_VERSION=$(node -e "console.log(require('./package.json').devDependencies['@nrwl/workspace'])")
TS_VERSION=$(node -e "console.log(require('./package.json').devDependencies['typescript'])")
NX_BIN_VERSION=$(node -e "console.log(require('./package.json').devDependencies['nx'])")

# Install @nrwl/workspace in order to run the affected command
yarn add -D @nrwl/workspace@$NX_VERSION --prefer-offline -W
yarn add -D typescript@$TS_VERSION --prefer-offline -W
yarn add -D nx@$NX_BIN_VERSION --prefer-offline -W

# Run the affected command, comparing latest commit to the one before that
yarn nx affected:apps --plain --base HEAD~1 --head HEAD | grep $APP -q

# Store result of the previous command (grep)
IS_AFFECTED=$?

if [ $IS_AFFECTED -eq 1 ]; then
  echo "🛑 -" $APP_TO_CHECK "not affected. Build cancelled."
  exit 0
elif [ $IS_AFFECTED -eq 0 ]; then
  echo "✅ -" $APP_TO_CHECK "affected. Build can proceed"
  exit 1
fi
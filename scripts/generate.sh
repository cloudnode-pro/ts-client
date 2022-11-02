#!/bin/sh
# Name of main class
MAIN_NAME=$(node scripts/getNameOfMain)

# delete existing src/MAIN_NAME.ts if it exists
if [ -f "src/$MAIN_NAME.ts" ]; then
  rm "src/$MAIN_NAME.ts"
fi

# build project
npm run build

# run generator
node gen

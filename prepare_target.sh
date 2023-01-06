#!/bin/bash
echo "Preparing to run project: $1"

# public
echo "Copying public files ..."
cp public/projects/$1/*.* public/
cp public/projects/$1/icons/ public/ -R
#cp public/projects/$1/img/ public/ -R
echo "Copying public files done!"

# Assets
echo "Copying assets files ..."
cp src/assets/projects/$1/css/ src/assets/ -R
cp src/assets/projects/$1/fonts/ src/assets/ -R
cp src/assets/projects/$1/icons/ src/assets/ -R
echo "Copying assets files done!"

# Contracts
echo "Copying contracts files ..."
cp src/contracts/projects/$1/*.* src/contracts/
echo "Copying contracts files done!"

# Settings
echo "Copying Settings files ..."
cp src/settings/projects/$1/*.* src/settings/
echo "Copying Settings files done!"

echo "Done preparing project! "
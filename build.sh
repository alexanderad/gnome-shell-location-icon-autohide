#!/bin/sh

SRC_DIR="location-icon-autohide@darednaxella.name"
SRC_ZIP="$SRC_DIR.zip"

rm -rf $SRC_ZIP

cd $SRC_DIR && zip -r ../$SRC_ZIP *

echo "Build complete: $SRC_ZIP"
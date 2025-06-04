#!/bin/bash
set -ex
echo "Running post-create script..."
# This script is executed after the container is created and the workspace is initialized.

while getopts w: flag; do
  case "${flag}" in
    w) local_workspace_path=${OPTARG} ;;
    *) throw 'Unknown argument' ;;
  esac
done

echo "local_workspace_path=${local_workspace_path}"

bun install
bun next telemetry disable
bun add next react react-dom
bunx commitizen init cz-conventional-changelog --save-dev --save-exact

if [[ -d /workspace/.git ]]; then
  echo "Setting safe.directory for git..."
  if ! git config --get-all safe.directory | grep -qx "/workspace"; then
    git config --global --add safe.directory /workspace || echo "git config safe.directory failed, but continuing..."
  else
    echo "/workspace is already listed as a safe.directory."
  fi
else
  echo "No .git directory found in /workspace, skipping git safe.directory configuration."
fi

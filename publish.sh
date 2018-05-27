#/bin/bash
set -euxo pipefail

oclif-dev pack # Build the Linux binaries
oclif-dev publish

oclif-dev pack:macos # Build the MacOS binaries
oclif-dev publish:macos 

oclif-dev pack:win # Build the Windows binaries 
oclif-dev publish:win

find . -type f ! -name "*.*" | grep -Pv "^\.\/(\.|node_modules|feed)"

# Turns a file without extension into a permalink (ie. name -> name/index.html)
xargs -I '{}' zsh -c "echo '{}' && mv '{}' '{}.html' && mkdir '{}' && mv '{}.html' '{}/index.html'"

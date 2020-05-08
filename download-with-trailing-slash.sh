echo $1
rm romaricpascal.is/$1
wget --random-wait -r -p --no-parent -e robots=off romaricpascal.is/$1/

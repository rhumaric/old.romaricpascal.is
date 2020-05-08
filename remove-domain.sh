grep -P -rl 'https?://romaricpascal.is' . | xargs perl -pi -e 's/
https?:\/\/romaricpascal.is//g'

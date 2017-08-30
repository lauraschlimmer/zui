build:
	node ./build.js

watch:
	fswatch . | xargs -n1 node ./build.js

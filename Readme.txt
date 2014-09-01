Require Optimizer
==================

For deployment of the SPA, use an optimized version of the code.
This includes RequireJS optimization of the javascript and css.
In order to run r.js (Require Optimizer), nodeJS needs to be installed on the build server.

A sample build process will look like this

- Triggering a build would check out files from the versioning system into a working directory.
- A node command is issued on the command line. 
	node <path to the r.js file> -o <path to the build file>
- The optimized output is dumped into the directory specified in the build file unless overridden at command line.
- Copy the optimized code into the web server for deployment.

- Refer to RequireJS Optimization for more information. - http://requirejs.org/docs/optimization.html	
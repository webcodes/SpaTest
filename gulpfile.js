var gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	minifycss = require("gulp-minify-css"),
	concat = require("gulp-concat"),
	jshint = require("gulp-jshint"),
	uglify = require("gulp-uglify"),
	notify = require("gulp-notify"),
	rename = require("gulp-rename"),
	del = require("del"),
	amdOptimize = require("gulp-amd-optimizer"),
	requirejs = require("requirejs");


var paths = {
	scripts: "scripts/**/*.js",
	styles: "contents/*.css",
	lib: "lib/**/*.js",
	distBase : "build/"
};


var requireConfig = {
    baseUrl: "scripts",
    dir: "build/scriptsprep",
    paths: {
        templates : "../templates",
        fixtures : "../fixtures",
        plugins : "./plugins",
        text: "../lib/text-2.0.12.min"
    },
    optimize: "none",			//wiil be taken care of by a gulp task once r.js concats all the dependent files.
    optimizeCss : "none",		//will be taken care of by styles task
    removeCombined: true,		//do not copy over the files to output dir once they have been combined into one of those module bundles.
    skipDirOptimize: false,		//no additional files need to be optimized nesides waht's specified in modules. Modules is what should have all
	keepBuildDir: true,		//this will be taken care of by the clean task
    modules: [
        { 
            name: "app",
            include: ["components/recentprofiles", "components/searchresults", "components/reports"]
        },
        {
            name: "components/profile",
            include: ["components/connections"]
        },
        {
            name: "components/flows",
            include: ["components/flows", "components/floweditor", "components/custidrenderer", "components/dummycomponent"]
        }
    ]
};

// Gulp Tasks

gulp.task("styles", ["clean"], function(){
	return gulp.src(paths.styles)
	.pipe(autoprefixer('last 2 versions', '> 1%', 'ie >= 9'))
	.pipe(gulp.dest(paths.distBase + 'contents/'))
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest(paths.distBase + "contents/"))
	.pipe(notify({message: "styles task completed."}));
});	

//this would have looked a lot cleaner and gulp-like.
/*gulp.task("scripts", function() {
	return gulp.src(paths.scripts)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('default'))
	.pipe(amdOptimize("app", {configFile: "app.build.js"}))
	.pipe(concat('app.js'))
	.pipe(uglify())
	.pipe(gulp.dest(paths.distBase + "scripts/"))
	.pipe(notify({message: "scripts task completed."}));
});*/

//the 4 tasks below to provide a gulp style optimization for scripts including requirejs modules.
//r.js can be directly run in node to do complete optimization. But it's a lot more consistent to do it through a task runner
//and provide a one shot build for all the tasks.
//Here jsHinting is the first task to lint all scripts. Then it's passed on to the rjs build system for finding require module dependencies and 
//bundling into modules. Look at the requireConfig above for the rjs build configurations. All the optimizations are turned off in favor of other gulp modules.
//rjs will just construct the dependency tree and create concat bundles.
// Then is the clean up of the output directory created by rjs.
//Ideally all the 4 tasks below could be a single gulp task once we have a complete gulp-requirejs module. The one commented out above is not complete since it
//does not support includes.

gulp.task("lintscripts", ["clean"], function() {
	return gulp.src(paths.scripts)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('default'));
});

gulp.task("rjsmods", ["lintscripts"], function(cb) {
	requirejs.optimize(requireConfig, function(buildResponse) {
		cb();
	},
	function(err) {
		cb(err);
	});
});

gulp.task("scripts", ["lintscripts", "rjsmods"], function() {
	return gulp.src(paths.distBase+"scriptsprep/**/*.js")
	.pipe(uglify())
	.pipe(gulp.dest(paths.distBase + "scripts/"))
	.pipe(notify({message: "scripts task completed."}));
});

gulp.task("cleanupScripts", ["scripts"], function(cb) {
	del([paths.distBase + "scriptsprep/"], cb); 
});

gulp.task("copy", ["clean"], function() {
	var app = gulp.src("index.html")
				.pipe(gulp.dest(paths.distBase));

	var lib = gulp.src(paths.lib)
	.pipe(gulp.dest(paths.distBase + "lib/"));

	var fixtures = gulp.src("fixtures/*.json")
	.pipe(gulp.dest(paths.distBase + "/fixtures/"));

});

gulp.task("clean", function(cb) {
	del([paths.distBase], cb); 
});

gulp.task('default', ['clean', "styles", "cleanupScripts", "copy"]);
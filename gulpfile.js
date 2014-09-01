var gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	minifycss = require("gulp-minify-css"),
	concat = require("gulp-concat"),
	jshint = require("gulp-jshint"),
	uglify = require("gulp-uglify"),
	notify = require("gulp-notify"),
	rename = require("gulp-rename"),
	del = require("del"),
	// clean = require("gulp-rimraf"),
	amdOptimize = require("amd-optimize"),
	requirejs = require("requirejs");


var paths = {
	scripts: "scripts/**/*.js",
	styles: "contents/*.css",
	//templates: "templates/**/*.html",
	lib: "lib/**/*.js",
	distBase : "build/"
};


var requireConfig = {
    appDir: "scripts",
    baseUrl: "./",
    dir: "./build/scripts",
    paths: {
        ko : "../lib",
        templates : "../templates",
        fixtures : "../fixtures",
        plugins : "./plugins"
    },
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

gulp.task("lint", ["clean"], function() {
	return gulp.src(paths.scripts)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('default'));
});

gulp.task("requiremodules", ["lint"], function(cb) {
	requirejs.optimize(requireConfig, function(buildResponse) {
		console.log('build response', buildResponse);
		cb();
	},
	function(err) {
		cb(err);
	});
});

gulp.task("scripts", ["lint", "requiremodules"]);

gulp.task("copy", ["clean"], function() {
	var app = gulp.src("index.html")
				.pipe(gulp.dest(paths.distBase));

	//templates are taken care of by r.js since most of those are AMD loads			
	// var templates = gulp.src(paths.templates)
	// .pipe(gulp.dest(paths.distBase + "templates/"));

	var lib = gulp.src(paths.lib)
	.pipe(gulp.dest(paths.distBase + "lib/"));

	var fixtures = gulp.src("fixtures/*.json")
	.pipe(gulp.dest(paths.distBase + "/fixtures/"));

});

/*gulp.task("clean", function(){
	return gulp.src(paths.distBase, {read: false})
	.pipe(clean());
});*/

gulp.task("clean", function(cb) {
	del([paths.distBase], cb); 
});

gulp.task('default', ['clean', "styles", "scripts", "copy"]);
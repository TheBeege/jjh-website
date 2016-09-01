var gulp = require("gulp"),
	jade = require("gulp-jade"),
	plumber = require("gulp-plumber"),
	data = require("gulp-data"),
	swig = require("gulp-swig"),
	path = require("path"),
	fs = require("fs"),
	browserSync = require("browser-sync"),
	replace = require("gulp-replace");

//file paths
var JADE_PATH = "src/jade/**/*.jade";

gulp.task("jade", function() {
	return gulp.src(JADE_PATH)
		.pipe(data(function(file){
			// dirname gets the path name minus the file name
			// split it using path.sep so it plays nicely on Windows and *nix systems
			// chop off the last portion of the path, insert "api", and use that last
			// segment of the path as the file name.
			// this WILL NOT work for files not inside a directory
			// honestly, i don't know why using the current directory ./<my path>
			// wasn't working
			var jsonFileName = path.dirname(file.path).split(path.sep).slice(0,-1).join(path.sep)
				+ path.sep + 'api' + path.sep
				+ path.dirname(file.path).split(path.sep).slice(-1) + ".jade.json";
			console.log('looking for jsonFileName: ' + jsonFileName);
			if(fs.existsSync(jsonFileName)) {
				console.log("found data file! requiring!");
				return require(jsonFileName);
			}
		}))
		.pipe(plumber(function(err){
			console.log("jade task error");
			console.log(err);
			this.emit("end");
		}))
		.pipe(swig())
		.pipe(jade())
		.pipe(gulp.dest("build"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

//for production
gulp.task("jade:prod", function() {
	console.log("starting jade task");
	return gulp.src(JADE_PATH)
		.pipe(plumber(function(err){
			console.log("styles task error");
			console.log(err);
			this.emit("end");
		}))
		.pipe(jade())
		//replace ="/ with ="http://...
		//.pipe(replace(/="\//g, '="http://michellehuang.net/'))
		.pipe(gulp.dest("build"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

var gulp = require("gulp"),
	plumber = require("gulp-plumber"),
	swig = require("gulp-swig"),
	browserSync = require("browser-sync"),
	replace = require("gulp-replace");

//file paths
var API_PATH = "src/jade/api/*.jade.json";

gulp.task("api", function() {
	return gulp.src(API_PATH)
		.pipe(plumber(function(err){
			console.log("jade task error");
			console.log(err);
			this.emit("end");
		}))
		.pipe(swig())
		.pipe(gulp.dest("build"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

//for production
gulp.task("api:prod", function() {
	console.log("starting api task");
	return gulp.src(API_PATH)
		.pipe(plumber(function(err){
			console.log("styles task error");
			console.log(err);
			this.emit("end");
		}))
		//replace ="/ with ="http://...
		//.pipe(replace(/="\//g, '="http://michellehuang.net/'))
		.pipe(gulp.dest("build"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

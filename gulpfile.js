var gulp = require("gulp"),
	webserver = require("gulp-webserver"),
	jade = require("gulp-jade"),
	uglify = require ("gulp-uglify"),
	concat = require("gulp-concat"),
	minify = require("gulp-minify-inline"),
	clean = require("gulp-clean-css"),
	sass = require("gulp-sass"),
	autopre = require("gulp-autoprefixer"),
	plumber = require("gulp-plumber"),
	sourcemaps = require("gulp-sourcemaps"),
	imagemin = require("gulp-imagemin"),
	jpegRecompress = require("imagemin-jpeg-recompress"),
	pngQuant = require("imagemin-pngquant"),
	del = require("del"),
	merge = require("merge-stream");

//file paths
var SCRIPTS_PATH = "src/js/**/*.js",
	CSS_PATH = "src/css/**/*.css",
	SASS_PATH = "src/css/**/*.sass",
	STYLES_PATH = "src/css/**/*.{css,sass}",
	JADE_PATH = "src/jade/**/*.jade",
	IMAGES_PATH = "src/images/**/*.{png,jpeg,jpg,svg,gif}",
	API_PATH = "src/jade/api/*.jade.json";

gulp.task("js", function() {
	console.log("starting js task");
	return gulp.src(["src/js/bootstrap.min.js", SCRIPTS_PATH])
		.pipe(plumber(function(err){
			console.log("scripts task error");
			console.log(err);
			this.emit("end");
		}))
		.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(concat("scripts.js"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/lib/js"));
});

gulp.task("images", function(){
	return gulp.src(IMAGES_PATH)
		.pipe(imagemin(
			[
				imagemin.gifsicle(),
				imagemin.jpegtran(),
				imagemin.optipng(),
				imagemin.svgo(),
				jpegRecompress(),
				pngQuant()
			]
		))
		.pipe(gulp.dest("build/images"));
});

// gulp.task("styles", function(){
// 	console.log("starting styles task");
// 	return gulp.src(["src/css/bootstrap.min.css", CSS_PATH, SASS_PATH])
// 		.pipe(plumber(function(err){
// 			console.log("styles task error");
// 			console.log(err);
// 			this.emit("end");
// 		}))
// 		.pipe(sourcemaps.init())
// 			.pipe(sass())
// 			.pipe(autopre())
// 			.pipe(clean())
// 			.pipe(concat("styles.css"))
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest("build/lib/css"));
// });

gulp.task("styles", function(){
	console.log("starting styles task");
	var sassStream = gulp.src(SASS_PATH)
		.pipe(plumber(function(err){
			console.log("styles task error");
			console.log(err);
			this.emit("end");
		}))
		.pipe(sass());

	var cssStream = gulp.src(CSS_PATH)
		.pipe(plumber(function(err){
			console.log("styles task error");
			console.log(err);
			this.emit("end");
		}));

	return merge(sassStream, cssStream)
		.pipe(sourcemaps.init())
			.pipe(concat("styles.css"))
			.pipe(autopre())
			.pipe(clean())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/lib/css"))
});

gulp.task("sass", function(){
	console.log("starting sass task");
	return gulp.src(SASS_PATH)
		.pipe(plumber(function(err){
			console.log("styles task error");
			console.log(err);
			this.emit("end");
		}))
		.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autopre())
			.pipe(minify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/lib/css"));
});

gulp.task("jade", function() {
	console.log("starting jade task");
	return gulp.src(JADE_PATH)
		.pipe(jade())
		.pipe(gulp.dest("build"));
});

gulp.task("api", function() {
	console.log("starting api task");
	return gulp.src(API_PATH)
		.pipe(gulp.dest("build"));
});

gulp.task("server", function(){
	console.log("starting server task")
	gulp.src("build")
		.pipe(webserver({
			livereload: true,
			fallback: "index.html",
			port: 8080,
			open: true
		}));
});

//delete entire build folder and start from scratch
// gulp.task("clean", function(){
// 	return del.sync([
// 		"build"
// 	])
// });

gulp.task("watch", function(){
	console.log("starting watch task")
	gulp.watch(SCRIPTS_PATH, ["js"]);
	gulp.watch(STYLES_PATH, ["styles"]);
	// gulp.watch([CSS_PATH, SASS_PATH], ["styles"]);
	gulp.watch(JADE_PATH, ["jade"]);
});

gulp.task("default", ["jade", "js", "styles", "server", "watch"], function(){
	console.log("starting default task");
});

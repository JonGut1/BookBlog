const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
/**
* converts the .scss files to css and stores,
* them in a new folder.
* also adds prefixes to certain commands, so that they,
* would work for other browsers and also for the last 2 versions.
*/
gulp.task('styles', function(done) {
	gulp.src('src/scss/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions']
	}))
	.pipe(gulp.dest('dist/css'))
	browserSync.reload();
	done()
});
/**
* Runs the default gulp command.
* it watches for the changes in .scss files, index.html and .js files.
*/
gulp.task('start', function(done) {
	/**
	* Refreshes the page after save file
	*/
	browserSync.init({
	     server: "dist/",
	     browser: ["google chrome"]
	});

	gulp.watch('src/scss/*.scss', gulp.series('styles'))
	gulp.watch('src/index.html', gulp.series('copy-html'))
	gulp.watch('src/js/*.js', gulp.series('scripts'))
	done()
});
/**
* Creates new .js files that are converted to ES 2015.
* also those files are saved in a different folder.
*/
gulp.task('scripts', function(done) {
	gulp.src('src/js/*.js')
	.pipe(sourcemaps.init())
	.pipe(babel( {
        presets: ['env']
    }))
    .pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/js'))
	browserSync.reload();
	done()
});
/**
* Copies the index.html file to a dist folder on save.
*/
gulp.task('copy-html', function(done) {
	gulp.src('src/index.html')
	.pipe(gulp.dest('dist'))
	browserSync.reload();
	done()
});

/*
* Build the app for the release
*/
gulp.task('build', function(done) {
	gulp.src('dist/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));

    gulp.src('dist/css/*.css')
    .pipe(concat('styles.css'))
    .pipe(uglify())
    .pipe(gulp.dest('build/css'));

    gulp.src('dist/index.html')
	.pipe(gulp.dest('build'))
	done()
});
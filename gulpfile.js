//更动通知 (gulp-notify)
/*var version = 'v1.0.0',
	dest = 'static/'+version,
	gulp = require('gulp'),							//导入工具包
	sass = require('gulp-sass'),					//编译Sass (gulp-ruby-sass)
	minifycss = require('gulp-minify-css'),			//css缩小化(minify)CSS (gulp-minify-css)
	jshint = require('gulp-jshint'),				//js语法检查
	concat = require('gulp-concat'),				//合并文件
	uglify = require('gulp-uglify'),				//js压缩代码(Uglify) (gulp-uglify)
	imagemin = require('gulp-imagemin'),			//图片压缩 (gulp-imagemin)
	clean = require('gulp-clean'),					//清理档案 (gulp-clean)
	livereload = require('gulp-livereload');		//即时重整(LiveReload) (gulp-livereload) 自动刷新*/

var gulp = require('gulp'),
	concat = require('gulp-concat'),				//合并文件
	minifycss = require('gulp-minify-css'),			//css缩小化(minify)CSS (gulp-minify-css)
	jshint = require('gulp-jshint'),				//js语法检查
	uglify = require('gulp-uglify');				//js压缩代码(Uglify)(gulp-uglify)
	
var $ = require('gulp-load-plugins')();	
	

	
gulp.task('css', function(){
	return gulp.src('css/*.min.css')
		.pipe(minifycss())
		.pipe(gulp.dest('build/css/'))
		.pipe($.livereload());
});
gulp.task('cssmin', function(){
	return gulp.src('css/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('build/css/'))
		.pipe($.livereload());
});
                              
gulp.task('sass', function(){
	return gulp.src('css/*.scss')
		.pipe($.sass())
		.pipe(minifycss())
		.pipe(gulp.dest('build/css/'))
		.pipe($.livereload());
});

gulp.task('jsmin', function(){
	return gulp.src(['js/**/*.js','!js/**/*.min.js'])
		.pipe($.plumber())
		.pipe(uglify({
			mangle: {except: ['require' ,'exports' ,'module' ,'$']}
		}))
		.pipe($.babel({
			presets : ['es2015']
		}))
		.pipe($.jshint())
		.pipe(gulp.dest('build/js/'))
		.pipe($.livereload());
});


gulp.task('js',function(){
	return gulp.src(['js/**/*.js'])	
		.pipe($.plumber())
		.pipe($.babel({
			presets : ['es2015']
		}))
		.pipe(gulp.dest('build/js/'))
		.pipe($.livereload());
})

	
gulp.task('minjs', function(){
	return gulp.src('js/**/*.min.js')
		.pipe(gulp.dest('build/js/'));
});

gulp.task('imagesmin', function(){
	return gulp.src('dist/**/*.{png,jpg,gif,svg,ico}')
		.pipe($.imagemin())
		.pipe(gulp.dest('build/'))
		.pipe($.livereload());
});

gulp.task('clean', function() {
    gulp.src(['build'], {read: false})
        .pipe($.clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('cssmin','css','sass','jsmin','minjs','imagesmin');
});

//测试任务 清空图片、样式、js并重建 运行语句gulp test
gulp.task('test',['clean'],function(){
	gulp.start('css','cssmin','sass','js','imagesmin');
})


//// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {
    gulp.watch('dist/**/*.css', ['cssmin']);
    gulp.watch('dist/**/*.scss', ['sass']);
    gulp.watch(['dist/**/*.js','!dist/**/*.min.js'], ['jsmin']);
    gulp.watch('dist/**/*.min.js', ['minjs']);
    gulp.watch('dist/**/*.{png,jpg,gif,svg,ico}', ['imagesmin']);
});

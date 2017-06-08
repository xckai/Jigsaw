var gulp = require('gulp');
const browserSync = require('browser-sync').create();
var less = require('gulp-less');
gulp.task("start",()=>{
    browserSync.init({server:{
        baseDir:"./",
        index:"dist/index.html"
    }})
gulp.src(['./src/**/*.html','./src/**/*.js','./src/**/*.css'],{base:"src"})
    .pipe(gulp.dest("./dist/"))
gulp.watch(['./src/**/*.html','./src/**/*.js'],(e)=>{
           gulp.src(e.path,{base:"src"}).pipe(gulp.dest('./dist/'))
          
        console.log(e.path+"-------js changed")
})
gulp.watch('./src/css/*.less',(e)=>{
    gulp.src(e.path,{base:"src"})
        .pipe(less())
        .pipe(gulp.dest("./dist/"))
   console.log(e.path+"-------css changed")
            
})
gulp.watch('./dist/**/*.*',()=>{
     browserSync.reload()
})
})
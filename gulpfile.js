var gulp = require('gulp');
const browserSync = require('browser-sync')
var proxy = require('http-proxy-middleware')
var less = require('gulp-less');
var ts = require('gulp-typescript');
var merge = require('merge2')
gulp.task("start",()=>{
    browserSync.create().init({server:{
        baseDir:"./",
        index:"dist/Pudong/index.html"
    }})
gulp.src(['./src/**/*.html','./src/**/*.js','./src/**/*.css'],{base:"src"})
    .pipe(gulp.dest("./dist/"))
gulp.watch(['./src/**/*.html','./src/**/*.js'],(e)=>{
           gulp.src(e.path,{base:"src"}).pipe(gulp.dest('./dist'))
          
        console.log(e.path+"-------js changed")
})
gulp.watch('./src/**/*.less',(e)=>{
    gulp.src('./src/Pudong/main.less',{base:"src"})
        .pipe(less())
        .pipe(gulp.dest("./dist/"))
   console.log(e.path+"-------css changed")
            
})
gulp.watch('./dist/**/*.*',()=>{
     browserSync.reload()
})
})
gulp.task('less', function() {
    var src = gulp.src('./src/**/*.ts',{base:"src"})
            .pipe(ts({
            "target": "es5",
                "module": "amd",
        })).pipe(gulp.dest('./dist'))
    // var chart= gulp.src('./node_modules/@types/smart_traffic_chart/src_new/**/*.ts',{base:"./node_modules/@types/smart_traffic_chart/src_new"})
    //         .pipe(ts({
    //         "target": "es5", 
    //             "module": "amd",
    // })).pipe(gulp.dest('./dist/smart_traffic_chart'))
 
});

gulp.task('tsall', function() {
    var src = gulp.src('./src/**/*.ts',{base:"src"})
            .pipe(ts({
            "target": "es5",
                "module": "amd",
        })).pipe(gulp.dest('./dist'))
    // var chart= gulp.src('./node_modules/@types/smart_traffic_chart/src_new/**/*.ts',{base:"./node_modules/@types/smart_traffic_chart/src_new"})
    //         .pipe(ts({
    //         "target": "es5", 
    //             "module": "amd",
    // })).pipe(gulp.dest('./dist/smart_traffic_chart'))
 
});



gulp.task("vicroad",["vicroadinit"],()=>{
    gulp.watch('src/**/*.less',{cwd:'./'},(e)=>{
        gulp.src('./src/Apps/Vicroad/main.less',{base:"src"})
            .pipe(less())
            .pipe(gulp.dest("./dist/"))
            console.log(e.path+"-------css changed")    
    })
    
    gulp.watch("src/**/*.ts",{cwd:'./'},(f)=>{
        gulp.src(f.path,{base:"src"})
            .pipe(ts({
                "target": "es5",
                "module": "amd",
                "baseUrl": "./",
                "paths": {
                    "moment": [
                        "vendor/moment/moment"
                    ]
                }
        })).pipe(gulp.dest('./dist'))
    })
    
    gulp.watch(["src/**/*.js","src/**/*.json","src/**/*.html","src/**/*.css"],{cwd:'./'},(f)=>{
         gulp.src(f.path,{base:"src"})
            .pipe(gulp.dest('./dist'))
    })

    var server= browserSync.create()
    // server.init({server:{
    //     baseDir:"./",
    //     index:"dist/Vicroad/index.html"
    // }})
 
    var middleware=proxy(['/service/apps',
    '/apps','/lib','/sap_logon.html','/j_spring_security_check','/resources'], {
             target: 'http://10.58.75.98:8080',
        
            //target:"http://10.59.176.34:8080"
        })
    var middleware2=proxy(['/eventbus','/socket.io'], {
           // target: 'http://10.59.176.34:8080',
           target: 'http://10.58.75.98:8089',
            ws: true,
        
           
        })
    var m3=proxy(['/services/vicroad','/eventbus/info'],{
       target: 'http://10.58.75.98:8089',
     //  target:"http://10.59.176.34:8080"
      
    })
    server.init({
        port: 3000,
		server: {
			baseDir: ['./'],
            index:"dist/Apps/Vicroad/index.html"
		},
		middleware:[middleware,middleware2,m3],
    })
    // gulp.watch('dist/**/*.*',{cwd:'./'},()=>{
    //      server.reload()
    // })


})
gulp.task("vicroadinit",()=>{
    gulp.src(['./src/Jigsaw/**/*.ts','./src/Apps/Vicroad/**/*.ts'],{base:"src"})
                .pipe(ts({
                "target": "es5",
                "module": "amd",
                "baseUrl": "./",
                "paths": {
                    "moment": [
                        "vendor/moment/moment"
                    ]
                }

            })).pipe(gulp.dest('./dist'))
    gulp.src(["./src/**/*.js","./src/**/*.json","./src/**/*.html","src/**/*.css"],{base:"src"})
        .pipe(gulp.dest("./dist"))
    // gulp.src(["./src/**/*.js","./src/**/*.json","./src/**/*.html"],{base:"src"})
    //     .pipe(gulp.dest("./dist"))
    gulp.src('./src/Vicroad/main.less',{base:"src"})
            .pipe(less())
            .pipe(gulp.dest("./dist/"))
})
gulp.task("bundle",()=>{
    var tsResult = gulp.src('src/Apps/Vicroad/App.ts')
        .pipe(ts({
            declaration: true,
            outFile: "main.js",
            module: "AMD",
            "baseUrl": "./",
                "paths": {
                    "moment": [
                        "vendor/moment/moment"
                    ]
                }
        }));
        var css = gulp.src('src/Apps/Vicroad/main.less');
        return merge([
        tsResult.js.pipe(gulp.dest('release/Vicroad')),
        css.pipe(less()).pipe(gulp.dest('release/Vicroad'))
    ]);
})
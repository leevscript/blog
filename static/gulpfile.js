var gulp = require('gulp');
var concat = require('gulp-concat');                            //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
var uglify = require('gulp-uglify');

gulp.task('concat', function() {                                //- 创建一个名为 concat 的 task
    gulp.src('./css/*.css')    //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('wap.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(gulp.dest('./css'))                               //- 输出文件本地
});

gulp.task("concat",function(){
    // 把1.js和2.js合并压缩为main.js，输出到dest/js目录下
    gulp.src('./js/vender/*.js')
        .pipe(concat('vender.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));
})

gulp.task('default', ['concat']);
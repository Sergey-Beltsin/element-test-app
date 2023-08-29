import gulp from "gulp";
import del from "del";
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browserSync from "browser-sync";
import csso from "gulp-csso";
import htmlmin from "gulp-htmlmin";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import svgstore from "gulp-svgstore";
import posthtml from "gulp-posthtml";
import include from "posthtml-include";

const sass = gulpSass(nodeSass);

// Local server (gulp watch)

gulp.task("watch", function () {
  browserSync.init({
    server: "build/",
  });
  gulp.watch("src/sass/**/*.scss", gulp.series("minify-css"));
  gulp.watch("src/*.html", gulp.series("html"));
});

// Minify CSS/HTML/JS

gulp.task("minify-css", function () {
  return gulp
    .src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(browserSync.stream())
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("minify", function () {
  return gulp
    .src("src/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      }),
    )
    .pipe(posthtml([include()]))
    .pipe(browserSync.stream())
    .pipe(gulp.dest("build"));
});

gulp.task("minify-js", function () {
  return gulp.src("src/js/*.js").pipe(uglify()).pipe(browserSync.stream()).pipe(gulp.dest("build/js"));
});

// Minify images/convert WebP/build sprite

gulp.task("images", function () {
  return gulp.src("src/assets/img/**/*.{png,jpg,svg}").pipe(imagemin()).pipe(gulp.dest("src/img"));
});

gulp.task("webp", function () {
  return gulp.src("src/assets/img/**/*.{png,jpg}").pipe(webp()).pipe(gulp.dest("src/assets/img"));
});

gulp.task("sprite", function () {
  return gulp
    .src("src/assets/img/icons/icon-*.svg")
    .pipe(
      svgstore({
        inlineSvg: true,
      }),
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build"));
});

gulp.task("html", function () {
  return gulp
    .src("src/*.html")
    .pipe(posthtml([include()]))
    .pipe(gulp.dest("build"));
});

// Build

gulp.task("copy", function () {
  return gulp
    .src(["src/assets/fonts/**/*.{woff,woff2,ttf}", "src/assets/img/**/*", "src/js/**"], {
      base: "src",
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("./build");
});

gulp.task("build", gulp.series("clean", "copy", "sprite", "images", "html", "minify", "minify-css", "minify-js"));

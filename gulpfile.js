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
import svgstore from "gulp-svgstore";
import posthtml from "gulp-posthtml";
import include from "posthtml-include";
import fileInclude from "gulp-file-include";

const sass = gulpSass(nodeSass);

// Local server (gulp watch)

gulp.task("watch", () => {
  browserSync.init({
    server: "build/",
  });
  gulp.watch("src/sass/**/*.scss", gulp.series("minify-css"));
  gulp.watch("src/**/*.html", gulp.series("minify"));
  gulp.watch("src/assets/img/**/*.{png,jpg}", gulp.series("images", "copy"));
  gulp.watch("src/assets/img/icons/icon-*.svg", gulp.series("sprite"));
  gulp.watch("src/js/*.js", gulp.series("minify-js"));
});

// Minify CSS/HTML/JS

gulp.task("minify-css", () =>
  gulp
    .src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(browserSync.stream())
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css")),
);

gulp.task("minify", () =>
  gulp
    .src("src/views/*.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(posthtml([include()]))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      }),
    )
    .pipe(browserSync.stream())
    .pipe(gulp.dest("build")),
);

gulp.task("minify-js", () =>
  gulp.src("src/js/*.js").pipe(uglify()).pipe(browserSync.stream()).pipe(gulp.dest("build/js")),
);

// Minify images/build sprite

gulp.task("images", () =>
  gulp
    .src("src/assets/img/**/*.{png,jpg}")
    .pipe(imagemin([imagemin.mozjpeg({ quality: 75, progressive: true }), imagemin.optipng({ optimizationLevel: 5 })]))
    .pipe(gulp.dest("src/assets/img")),
);

gulp.task("sprite", () =>
  gulp
    .src("src/assets/img/icons/icon-*.svg")
    .pipe(
      svgstore({
        inlineSvg: true,
      }),
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build")),
);

// Build

gulp.task("copy", () =>
  gulp
    .src(["src/assets/fonts/**/*.{woff,woff2,ttf}", "src/assets/img/**/*", "src/js/**"], {
      base: "src",
    })
    .pipe(gulp.dest("build")),
);

gulp.task("clean", () => del("./build"));

gulp.task("build", gulp.series("clean", "copy", "sprite", "images", "minify", "minify-css", "minify-js"));

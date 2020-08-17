const gulp = require("gulp");
const ts = require("gulp-typescript");
const eslint = require("gulp-eslint");
const tsConfig = ts.createProject("tsconfig.json", {
  noImplicitAny: true,
});

const paths = {
  scripts: {
    src: "src/**/*.ts",
    dest: "dest/**/*.js",
  },
};

// typescript to javascript transpiler.
function scripts() {
  return tsConfig.src().pipe(tsConfig()).js.pipe(gulp.dest("dest"));
}

// es6 linter
function linter() {
  return gulp
    .src(paths.scripts.dest)
    .pipe(
      eslint({
        useEslintrc: true,
      })
    )
    .pipe(eslint.format());
}

let build = gulp.series(scripts, linter);

function watch() {
  console.log("inside watch");
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.scripts.dest, linter);
}

exports.watch = watch;
exports.build = build;

if (process.env.ENV === "development") {
}

exports.default = build;

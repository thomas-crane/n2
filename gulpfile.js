var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');

const CONFIG = require('./tsconfig.json');
const MODULES = [
  'common',
  'net',
  'updater',
  'core',
];

//#region build
function cleanModule(module) {
  const func = del.bind(undefined, [`modules/${module}/dist/**/*.*`]);
  func.displayName = `clean:${module}`;
  return func;
}

const clean = gulp.parallel(...MODULES.map(m => cleanModule(m)));

// add clean tasks
gulp.task('clean', clean);
MODULES.map(m => gulp.task(`clean:${m}`, cleanModule(m)));

function compileModule(module) {
  const func = ((m) => {
    return gulp.src(`modules/${m}/src/**/*.ts`)
      .pipe(ts(CONFIG.compilerOptions))
      .pipe(gulp.dest(`modules/${m}/dist`))
  }).bind(undefined, module);
  func.displayName = `compile:${module}`;
  return func;
};



const compile = gulp.series(
  compileModule('common'),
  compileModule('net'),
  gulp.parallel(
    compileModule('updater'),
    compileModule('core')
  )
);

// add compile tasks
gulp.task('compile', compile);
MODULES.map(m => gulp.task(`compile:${m}`, compileModule(m)));

const build = gulp.series(clean, compile);
gulp.task('build', build);
MODULES.map(m => gulp.task(`build:${m}`, gulp.series(cleanModule(m), compileModule(m))));
//#endregion

gulp.task('default', build);
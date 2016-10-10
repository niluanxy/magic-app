var gulp         = require('gulp-param')(require('gulp'), process.argv),
    shell        = require('gulp-shell'),
    del          = require("del"),
    Q            = require("q"),
    fs           = require("fs"),
    gulpif       = require("gulp-if"),
    sass         = require("gulp-sass"),
    replace      = require("gulp-replace"),
    px2rem       = require("gulp-px2rem"),
    hashint      = require("hash-int"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss    = require("gulp-minify-css"),
    uglify       = require("gulp-uglify"),
    htmlmin      = require('gulp-htmlmin'),
    rename       = require("gulp-rename"),
    webpack      = require("gulp-webpack"),
    browserSync  = require("browser-sync"),
    reload       = browserSync.reload,
    concat       = require("gulp-concat");


var DIR_APP       = __dirname + "/app/",
    DIR_MIXIN     = __dirname + "/dev/mixin/",
    DIR_MINJS     = __dirname + "/dev/minjs/",
    DIR_MAGIC     = __dirname + "/dev/magic/",
    DIR_MAGIC_VUE = __dirname + "/dev/magic-vue/",
    DIR_CORDOVA   = __dirname + "/cordova/",
    DIR_RESOURCE  = __dirname + "/resource/",
    DIR_MODULE    = "module",
    DIR_PUBLIC    = "public/",
    DIR_APP_PUB   = DIR_APP+DIR_PUBLIC;

var px2remOptions = {
        rootValue: 20,
        unitPrecision: 5,
        propertyBlackList: [],
        propertyWhiteList: [],
        replace: true,
        mediaQuery: false,
        minPx: 3
    };

var release = false;    // 是否为发布输出，发布输出会压缩优化
var cordova = false;    // APP打包是否为cordova输出
/* mixin 想关任务方法 */
function task_dev_mixin() {
    var defer = Q.defer(), path = DIR_APP_PUB+"css/lib/";

    gulp.src([DIR_MIXIN+"base/tools.scss",
        DIR_MIXIN+"base/z-index.scss",
        DIR_MIXIN+"base/color.scss",
        DIR_MIXIN+"base/*.scss"])
    .pipe(concat("mixin_base.scss"))
    .pipe(gulp.dest(path))

    .on("finish", function() {
        gulp.src([DIR_MIXIN+"eui/varible/button.scss",
            DIR_MIXIN+"eui/varible/*.scss"])
        .pipe(concat("mixin_coms.scss"))
        .pipe(gulp.dest(path))

        .on("finish", function() {
            gulp.src([
                DIR_MIXIN+"core/animate.scss",
                DIR_MIXIN+"core/tool.scss",
                DIR_MIXIN+"core/*.scss",
                DIR_MIXIN+"eui/component/*.scss"])
            .pipe(concat("mixin_end.scss"))
            .pipe(gulp.dest(path))

            .on("finish", function() {
                gulp.src([
                    path+"mixin_base.scss",
                    path+"mixin_coms.scss",
                    path+"mixin_end.scss"])
                .pipe(concat("mixin.scss"))

                .pipe(gulp.dest(DIR_MAGIC+"lib/"))
                .on("finish", function() { defer.resolve(); });
            })
        })
    })

    return defer.promise;
}
gulp.task("dev-mixin", task_dev_mixin);


/* minjs 相关任务方法 */
function task_dev_minjs() {
    var defer = Q.defer();

    // gulp.src(DIR_MINJS+"route.js")
    // .pipe(gulp.dest(DIR_MAGIC_VUE+"lib/"));

    gulp.src(DIR_MINJS+"*.js")
    .pipe(gulp.dest(DIR_MAGIC+"lib/minjs/"))
    .on("finish", function() { defer.resolve() });

    return defer.promise;
}
gulp.task("dev-minjs", task_dev_minjs)


/* magic 相关任务方法 */
function task_dev_magic_css() {
    var defer = Q.defer();

    gulp.src(DIR_MAGIC+"main.scss")
    .pipe(sass({
            includePaths: [DIR_MAGIC]
        }))
    .pipe(autoprefixer())
    .pipe(px2rem(px2remOptions))
    .pipe(rename("magic.css"))
    .pipe(gulp.dest(DIR_APP_PUB+"lib/"))
    .on("finish", function() { defer.resolve(); });

    return defer.promise;
}
gulp.task("dev-magic-css", task_dev_magic_css);

function task_dev_magic_js() {
    var LIB_MINJS = DIR_MAGIC + "lib/minjs/",
        DIR_CORE  = DIR_MAGIC;

    var defer = Q.defer();

    gulp.src(DIR_MAGIC+"**/style.scss")
    .pipe(sass({
        includePaths: [DIR_MAGIC]
    }))
    .pipe(autoprefixer())
    .pipe(px2rem(px2remOptions))
    .pipe(gulpif(release, minifycss()))
    .pipe(gulp.dest(DIR_MAGIC))
    .on("finish", function() {
        webpack({
                entry: DIR_CORE + "main.js",
                output: {
                    filename: "magic.js"
                },
                resolve: {
                    alias: {
                        util      : LIB_MINJS + "util.js",
                        query     : LIB_MINJS + "selector.js",
                        event     : LIB_MINJS + "event.js",
                        domready  : LIB_MINJS + "ondomready.js",
                        dom       : LIB_MINJS + "dom.js",
                        extend    : LIB_MINJS + "extend.js",
                        promise   : LIB_MINJS + "promise.js",
                        jsonp     : LIB_MINJS + "jsonp.js",
                        templayed : LIB_MINJS + "templayed.js",
                        route     : LIB_MINJS + "route.js",
                    }
                },
                module: {
                    loaders: [
                        { test: /\.html$/, loader: "html" },
                        { test: /\.css$/, loader: "style!css" }
                    ]
                }
            })
        // .pipe(gulp.dest(DIR_MAGIC_VUE+"lib/"))
        .pipe(gulp.dest(DIR_APP_PUB + "lib/"))
        .on("finish", function() { defer.resolve(); });
    })


    return defer.promise;
}
gulp.task("dev-magic-js", task_dev_magic_js);


/* magic-vue 相关任务*/
function task_dev_magic_vue() {
    var DIR_SRC = DIR_MAGIC_VUE;

    var defer = Q.defer();

    webpack({
            entry: DIR_SRC+"main.js",
            output: {
                filename: "magic.vue.js"
            },
            resolve: {
                alias: {
                    magic : DIR_MAGIC,
                    mgvue : DIR_MAGIC_VUE,
                    route : DIR_MINJS + "route.js",
                }
            },
            module: {
                loaders: [
                    { test: /\.(jpg|png|gif)$/, loader: "url-loader" },
                    { test: /\.html$/, loader: "html" },
                    { test: /\.scss$/, loader: "style!css!sass!autoprefixer" }
                ]
            }
        })
    .pipe(gulp.dest(DIR_APP_PUB+"lib/"))
    .on("finish", function() { defer.resolve() });

    return defer.promise;
}
gulp.task("dev-magic-vue", task_dev_magic_vue);


/* APP 相关任务 */
function task_dev_app_pub() {
    var defer = Q.defer(),
        fpath = cordova?DIR_CORDOVA+"www/":
                        DIR_APP+"dist/";

    gulp.src([DIR_APP_PUB+"**/*", "!"+DIR_APP_PUB+"main*",
              "!"+DIR_APP_PUB+"lib/mixin.scss",
              "!"+DIR_APP_PUB+"css/"])
    .pipe(gulp.dest(fpath+DIR_PUBLIC))
    .on("finish", function() {
        del(fpath+DIR_PUBLIC+"css");      // 空文件夹删除
        defer.resolve();            // 方法执行完通知
    });

    return defer.promise;
}
gulp.task("dev-app-pub", task_dev_app_pub);


function task_dev_app_html() {
    var defer = Q.defer(),
        fpath = cordova?DIR_CORDOVA+"www/":
                        DIR_APP+"dist/";

    gulp.src(DIR_APP+"index.html")
    .pipe(gulpif(release, htmlmin({
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
        })
    ))
    .pipe(gulp.dest(fpath))
    .on("finish", function() { defer.resolve() });

    return defer.promise;
}
gulp.task("dev-app-html", task_dev_app_html);

function task_dev_app_css() {
    var defer = Q.defer(), base = [], build,
        fpath = cordova?DIR_CORDOVA+"www/":
                        DIR_APP+"dist/";

    base = [DIR_APP_PUB+"css/lib/mixin_base.scss",

            DIR_APP_PUB+"css/varible/z-index.scss",
            DIR_APP_PUB+"css/varible/color.scss",
            DIR_APP_PUB+"css/varible/core.scss",
            DIR_APP_PUB+"css/varible/tool.scss",

            DIR_APP_PUB+"css/lib/mixin_coms.scss",

            DIR_APP_PUB+"css/varible/button.scss",
            DIR_APP_PUB+"css/varible/*.scss",

            DIR_APP_PUB+"css/lib/mixin_end.scss",

            DIR_APP_PUB+"css/component/*.scss"]

    build = base.slice(0).concat([DIR_APP_PUB+"css/*.scss",
                                  DIR_APP_PUB+"css/main.scss",
                                  DIR_APP_PUB+"css/build.scss"]);

    del(fpath+"page/main.css", function() {

        gulp.src(base).pipe(concat("mixin.scss"))
            .pipe(gulp.dest(DIR_APP_PUB))
            .on("finish", function() {
                gulp.src(build)
                .pipe(concat("main.scss"))
                .pipe(gulp.dest(DIR_APP_PUB+""))
                .on("finish", function() {
                    var hash = hashint((new Date).getTime())+"",
                        name = "main"+hash.substr(0, 5)+".css",
                        newn = release?name:"main.css";

                    gulp.src(DIR_APP_PUB+"main.scss")
                    .pipe(sass({
                        includePaths: [DIR_APP, DIR_APP+DIR_MODULE]
                    }))
                    .pipe(autoprefixer())
                    .pipe(px2rem(px2remOptions))
                    .pipe(gulpif(release, minifycss()))
                    .pipe(rename(newn))
                    .pipe(gulp.dest(fpath+"page/"))
                    .on("finish", function() {
                        gulp.src(fpath+"index.html")
                        .pipe(replace(/main.*\.css/, newn))
                        .pipe(gulp.dest(fpath))
                        .on("finish", function() {
                            defer.resolve();
                        })
                    })
                });
            })
    });

    return defer.promise;
}
gulp.task("dev-app-css", ["dev-mixin"], task_dev_app_css);

function task_dev_app_js() {
    var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin.js");
    var DefinePlugin   = require("webpack/lib/DefinePlugin.js");
    var CordovaPlugin  = require('webpack-cordova-plugin');
    var commonsPlugin  = require("webpack/lib/optimize/CommonsChunkPlugin");
    var HtmlWebpackPlugin = require('html-webpack-plugin');

    var LIB_MINJS = DIR_MAGIC + "lib/minjs/";
    var pugls = release ? [new UglifyJsPlugin({
                    sourceMap: false,
                    minimize: true,
                    compress: {
                        warnings: false
                    }
                }), new DefinePlugin({
                    'process.env': {
                        NODE_ENV: '"production"'
                    }
                })] : [];

    if (cordova) pugls.push(new CordovaPlugin({
                config: 'config.xml',
                src: 'index.html',
                platform: 'android',
                version: true,
            }));

    var defer = Q.defer(),
        fpath = cordova?DIR_CORDOVA+"www/":
                        DIR_APP+"dist/",
        wname = release?"[name][hash:5].js":"[name].js";

    del(fpath+"page/*.js", function() {
        gulp.src(DIR_APP+"**/style.scss")
        .pipe(sass({
            includePaths: [DIR_APP, DIR_APP+DIR_MODULE]
        }))
        .pipe(autoprefixer())
        .pipe(px2rem(px2remOptions))
        .pipe(gulpif(release, minifycss()))
        .pipe(gulp.dest(DIR_APP))
        .on("finish", function() {
            webpack({
                context: DIR_APP,
                entry: [DIR_APP_PUB + "main.js"],
                output: {
                    filename: wname,
                    publicPath: "./page/"
                },
                module: {
                    loaders: [
                        { test: /\.html$/, loader: "vue-html"},
                        { test: /\.css$/, loader: "style!css" },
                        { test: /\.scss$/, loader: "style!css!sass!autoprefixer" },
                        { test: /\.(jpg|png|gif)$/, loader: "url-loader?limit=8192&name=../"+DIR_PUBLIC+"img/[name].[ext]" },
                    ]
                },
                resolve: {
                    alias: {
                        magic     : DIR_MAGIC,
                        mgvue     : DIR_MAGIC_VUE,

                        util      : LIB_MINJS + "util.js",
                        query     : LIB_MINJS + "selector.js",
                        event     : LIB_MINJS + "event.js",
                        domready  : LIB_MINJS + "ondomready.js",
                        dom       : LIB_MINJS + "dom.js",
                        extend    : LIB_MINJS + "extend.js",
                        promise   : LIB_MINJS + "promise.js",
                        jsonp     : LIB_MINJS + "jsonp.js",
                        templayed : LIB_MINJS + "templayed.js",
                        route     : LIB_MINJS + "route.js",

                        module    : DIR_APP + DIR_MODULE,
                        page      : DIR_APP + "page/",
                        public    : DIR_APP_PUB,
                    }
                },
                plugins: pugls,
            })
            .pipe(gulp.dest(fpath + "page"))
            .on("finish", function() {
                if (release /* 发布时才添加hash */) {
                    var hash = hashint((new Date).getTime())+"",
                        name = "main"+hash.substr(0, 5)+".js",
                        path = fpath+"page/";

                    fs.readdir(path, function(error, files) {
                        for(var i=0; i<files.length; i++) {
                            var str = files[i].toString();
                            if (str.match(/main.*\.js/)) {
                                fs.rename(path+str, path+name);

                                // 修改 index.html 中的引用
                                gulp.src(fpath+"index.html")
                                .pipe(replace(/main.*\.js/, name))
                                .pipe(gulp.dest(fpath))

                                break;      defer.resolve();
                            }
                        }
                    })
                } else {
                    defer.resolve();
                }
            })
        });
    });

    return defer.promise;
}
gulp.task("dev-app-js", ["dev-app-css"], task_dev_app_js);

gulp.task("dev-app", function(rel) {
    release = rel ? true : false;

    return Q.all([
        task_dev_app_pub(),
        task_dev_app_html(),
        task_dev_app_css(),
        task_dev_app_js()
    ]);
})

gulp.task("cordova", function(rel) {
    cordova = true; // 设置cordova打包模式
    release = rel ? true : false;

    del(DIR_CORDOVA+"www", function() {
        Q.all([
            task_dev_app_pub(),
            task_dev_app_html(),
            task_dev_app_css(),
            task_dev_app_js()
        ]).then(function() {
            // 删除自动生成的多余文件
            del("www");
            del("plugins");
            del("config.xml");
        });
    });
})

var errmsg = "\b\b\b\b<%= error.message %>";

/* 创建 cordova 项目 */
gulp.task("create_base", shell.task([
    "cordova create cordova com.magic.app main"
], {errorMessage: errmsg}))

gulp.task("cordova-create", ["create_base"], function(demo) {
    var test = demo ? true : false, defer = Q.defer(), path;

    path = test ? "demo/**/*" : "prod/**/*";

    gulp.src(DIR_RESOURCE + "config.xml")
        .pipe(gulp.dest(DIR_CORDOVA));

    gulp.src(DIR_RESOURCE + path)
        .pipe(gulp.dest(DIR_CORDOVA+"resource/"))
})


/* 配置文件更新 */
gulp.task("cordova-config", function() {
    var path = DIR_CORDOVA + "platforms/android";

    gulp.src(DIR_RESOURCE + "config.xml")
    .pipe(gulp.dest(DIR_CORDOVA))
    .on("finish", function() {
        gulp.src(DIR_RESOURCE + "plugins/**/*")
        .pipe(gulp.dest(DIR_CORDOVA+"plugins"))
    })
})

gulp.task("cordova-platform", ["cordova-config"], function() {
    gulp.src(DIR_RESOURCE + "platforms/**/*")
    .pipe(gulp.dest(DIR_CORDOVA+"platforms"))
})

/* 添加android平台 */
gulp.task("cordova-android", ["cordova-config"], shell.task([
    "cordova platform add android"
], {errorMessage: errmsg, cwd: "cordova"}))


/* 添加android平台 */
gulp.task("cordova-ios", ["cordova-config"], shell.task([
    "cordova platform add ios"
], {errorMessage: errmsg, cwd: "cordova"}))



/* android 只生成 apk 安装文件 */
gulp.task("cordova-output-android", function() {
    var base = __dirname, path;
    path = "platforms/android/build/outputs/apk/*.apk";

    del(base+"/output/*", function() {
        gulp.src(DIR_CORDOVA+path)
            .pipe(gulp.dest(base+"/output/"));
    })
})

gulp.task("cordova-build-android", ["cordova-platform"], shell.task([
    "gulp cordova",
    "cordova build android",
    "gulp cordova-output-android",
], {errorMessage: errmsg, cwd: "cordova"}))


/* ios 生成 project 文件 */
gulp.task("cordova-build-ios", ["cordova-platform"], shell.task([
    "gulp cordova",
    "cordova build ios"
], {errorMessage: errmsg, cwd: "cordova"}))


/* 直接安装apk到手机上 */
gulp.task("cordova-run-android", ["cordova-platform"], shell.task([
    "gulp cordova",
    "cordova run android",
    "gulp cordova-output-android",
], {errorMessage: errmsg, cwd: "cordova"}))


gulp.task("watch-magic-js", function() {
    task_dev_magic_js().then(function() {
        task_dev_app_pub();
    })
})


/* 监控刷新调试 */
gulp.task("serve", function() {
    var pub_path = "app/"+DIR_PUBLIC;

    browserSync({
        server: "./app/dist/"
    });

    /* mixin 动态刷新任务 */
    gulp.watch(["dev/mixin/**/*.scss"], ["dev-mixin"])

    /* minjs 动态刷新任务 */
    gulp.watch(["dev/minjs/*.js"], ["dev-minjs"])

    /* magic 动态刷新任务 */
    gulp.watch(["dev/magic/core/*.scss", "dev/magic/lib/mixin.scss"],
                ["dev-magic-css", reload])
    gulp.watch(["dev/magic/**/*.js", "dev/magic/**/*.scss",
                "dev/magic/**/*.html", "!dev/magic/core/*.scss",
                "!dev/magic/lib/mixin.scss", "!dev/magic/lib/*.js"],
                ["dev-magic-js", reload])

    /* magic-vue 动态刷新任务 */
    gulp.watch(["dev/magic-vue/**/*"], ["dev-magic-vue", reload])

    /* APP 动态刷新任务 */
    gulp.watch(["app/index.html"], ["dev-app-html", reload])
    gulp.watch([pub_path+"css/**/*.scss"], ["dev-app-css", reload])
    gulp.watch([pub_path+"lib/*.js", pub_path+"css/**/*", "app/page/**/*", pub_path+"main.js",
                "app/"+DIR_MODULE+"/**/*", "!app/**/style.css"], ["dev-app-js", reload])
    gulp.watch([pub_path+"**/*", "!"+pub_path+"main.*", "!"+pub_path+"lib/magic*",
                "!"+pub_path+"mixin.scss", "!"+pub_path+"css/**/*"], ["dev-app-pub", reload])
})


/* 全局构建任务 */
gulp.task("build.base", function() {
    return Q.all([
        task_dev_mixin(),
        task_dev_minjs()
    ]);
})

gulp.task("build.magic", ["build.base"], function(rel) {
    release = rel ? true : false;

    return Q.all([
        task_dev_magic_css(),
        task_dev_magic_js()
    ]);
})

gulp.task("build.vue", ["build.magic"], function(rel) {
    release = rel ? true : false;

    return Q.all([task_dev_magic_vue()]);
})

gulp.task("build.app", ["build.vue"], function(rel) {
    release = rel ? true : false;

    gulp.run("dev-app");
})

gulp.task("build", ["dev-app-css"], function(rel) {
    release = rel ? true : false;

    gulp.run("build.app");
})

/* APP 清理任务 */
gulp.task("clean", function() {
    del(DIR_APP + "dist/");
    del(DIR_APP_PUB + "main.css");
    del(DIR_APP_PUB + "main.scss");
    del(DIR_APP_PUB + "lib/magic*");
    del(DIR_APP_PUB + "css/lib");
    del(DIR_APP_PUB + "lib/mixin.scss");
})

gulp.task("clean.cordova", function() {
    // 删除自动生成的多余文件
    del("www");
    del("plugins");
    del("config.xml");
})

gulp.task("del-cordova", function() {
    del("cordova");
    del("output");
})

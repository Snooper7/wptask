const fileswatch = "html,htm,txt,json,md";
const baseUrlSrs = "dev/src"
const baseUrlDist = "dev/assets"
import pkg from "gulp";

const {gulp, src, dest, parallel, series, watch} = pkg;
import browserSync from "browser-sync";
import bssi from "browsersync-ssi";
import ssi from "ssi";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import sassglob from "gulp-sass-glob";
import webp from "gulp-webp";
import gulpif from "gulp-if";

const sass = gulpSass(dartSass);
import postCss from "gulp-postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";
import concat from "gulp-concat";
import rsync from "gulp-rsync";
import del from "del";
import sourcemaps from "gulp-sourcemaps"

let param = '--dev'//--build

console.log(process.argv[3])
if (process.argv[3] === '--dev' || process.argv[3] === '--build') {
    param = process.argv[3];
}


async function cleandist() {
    del("app/**/*", {force: true});
}

async function buildhtml() {
    let includes = new ssi("dev/", "app/", "/**/*.html");
    includes.compile();
    del("app/parts", {force: true});
    del("app/src", {force: true});
}

function buildcopy() {
    return src(
        [
            `dev/**/*`,
            `!dev/src/**/*`,

        ],
        {base: "dev/"}
    ).pipe(dest("app"));
}


function browsersync() {
    browserSync.init({
        server: {
            baseDir: "dev/",
            middleware: bssi({baseDir: "dev/", ext: ".html"}),
        },
        ghostMode: {clicks: false},
        notify: false,
        online: true,
        // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
    });
}


function scripts() {
    // let plugins = {};
    let optionMode;
    let optionDefault = {
        performance: {hints: false},
        // plugins: [plugins],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: ["babel-plugin-root-import", '@babel/plugin-transform-runtime'],
                        },
                    },
                },
            ],
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {format: {comments: false}},
                    extractComments: false,
                }),
            ],
        }
    };
    switch (param) {
        case '--dev':
            optionMode = {
                mode: 'development',
            }
            break;
        case '--build':
            optionMode = {
                mode: 'production',
            }
    }
    let option = Object.assign({}, optionMode, optionDefault);
    return src([`${baseUrlSrs}/js/app.js`])
        .pipe(webpackStream(option, webpack))
        .pipe(concat("app.min.js"))
        .pipe(dest(`${baseUrlDist}`))
        .pipe(browserSync.stream());
}

function styles() {
    let is_dev;
    switch (param) {
        case '--dev':
            is_dev = true;
            break;
        case '--build':
            is_dev = false;
    }
    return src([
        `${baseUrlSrs}/styles/*.*`,
        `!${baseUrlSrs}/styles/css/**/*`,
        `!${baseUrlSrs}/styles/_*.*`,
    ])

        .pipe(gulpif(is_dev, sourcemaps.init({loadMaps: true})))
        .pipe(sassglob())
        .pipe(sass({"include css": true}))
        .pipe(gulpif(is_dev,
            postCss([autoprefixer({grid: "autoplace"})]),
            postCss([autoprefixer({grid: "autoplace"}), cssnano({preset: ["default", {discardComments: {removeAll: true}}]}),
        ])))
        .pipe(concat("app.min.css"))
        .pipe(gulpif(is_dev, sourcemaps.write()))
        .pipe(dest(`${baseUrlDist}`))
        .pipe(browserSync.stream());
}

function images() {
    return src([`${baseUrlSrs}/images/**/*`])
        .pipe(changed(`${baseUrlDist}/images`))
        .pipe(imagemin())
        .pipe(dest(`${baseUrlDist}/images`))
        .pipe(browserSync.stream());
}

function fonts() {
    return src([`${baseUrlSrs}/fonts/**/*`])
        .pipe(changed(`${baseUrlDist}/fonts`))
        .pipe(dest(`${baseUrlDist}/fonts`))
        .pipe(browserSync.stream());
}

function images_webp() {
    return src([`${baseUrlSrs}/images/**/*`, `!${baseUrlSrs}/images/**/*.svg`])
        .pipe(changed(`${baseUrlDist}/images`))
        .pipe(webp())
        .pipe(dest(`${baseUrlDist}/images`))
        .pipe(browserSync.stream());
}


function startwatch() {
    watch(`${baseUrlSrs}/styles/**/*`, {usePolling: true}, styles);
    watch(`${baseUrlSrs}/js/**/*`, {usePolling: true}, scripts);
    watch(`${baseUrlSrs}/images/**/*`, {usePolling: true}, parallel(images, images_webp));
    watch(`${baseUrlSrs}/fonts/**/*`, {usePolling: true}, fonts);
    watch(`dev/**/*.{${fileswatch}}`, {usePolling: true}).on(
        "change",
        browserSync.reload
    );
}

function deploy() {
    return src("app/").pipe(
        rsync({
            root: "app/",
            hostname: "username@yousite.com",
            destination: "yousite/public_html/",
            // clean: true, // Mirror copy with file deletion
            include: [
                /* '*.htaccess' */
            ], // Included files to deploy,
            exclude: ["**/Thumbs.db", "**/*.DS_Store"],
            recursive: true,
            archive: true,
            silent: false,
            compress: true,
        })
    );
}


// function smartGrid(done) {
//     let settings = {
//         filename: '_smartGrid',
//         outputStyle: "sсss" /* less || scss || sass || styl */,
//         columns: 60 /* number of grid columns */,
//         offset: "10px" /* gutter width px || % || rem */,
//         mobileFirst: true /* mobileFirst ? 'min-width' : 'max-width' */,
//         container: {
//             maxWidth: "100%" /* max-width оn very large screen */,
//             fields: "10px",
//         },
//         breakPoints: {
//             lg: {
//                 width: "1280px",
//                 fields: "50px",
//                 offset: "30px",
//             },
//             md: {
//                 width: "960px",
//                 fields: "30px",
//                 offset: "20px",
//             },
//             sm: {
//                 width: "600px",
//             },
//             xs: {
//                 width: "450px",
//             },
//         },
//     };
//     // smartgrid(`${baseUrlSrs}/styles/`, settings);
//     done();
// }


export {scripts, styles, images, images_webp, fonts, deploy};
export let assets = series(scripts, styles, parallel(images, images_webp,));
export default series((done) => {
        param = '--dev';
        done()
    },
    scripts,
    styles,
    parallel(images, images_webp, fonts),
    parallel(browsersync, startwatch)
);

export let build = series(
    (done) => {
        param = '--build';
        done();
    },
    cleandist,
    parallel(images, images_webp, fonts),
    scripts,
    styles,
    buildcopy,
    buildhtml
);


//

// export let build =
//
//

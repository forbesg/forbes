var Metalsmith = require('metalsmith'),
    metadata = require('metalsmith-metadata'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    layouts = require('metalsmith-layouts'),
    collections = require('metalsmith-collections'),
    branch = require('metalsmith-branch'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    Handlebars = require('handlebars'),
    fs = require('fs');

Handlebars.registerPartial({
  'head': fs.readFileSync('./layouts/partials/head.hbs').toString(),
  'header': fs.readFileSync('./layouts/partials/header.hbs').toString(),
  'projects': fs.readFileSync('./layouts/partials/projects.hbs').toString(),
  'contact': fs.readFileSync('./layouts/partials/contact.hbs').toString(),
  'footer': fs.readFileSync('./layouts/partials/footer.hbs').toString()
});
Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

var metalsmith = new Metalsmith(__dirname)
    .source('src')
    // .use(metadata({
    //   rootpath: 'http://localhost:3000'
    // }))
    .use(markdown())
    .use(collections({
        pages: {
          pattern: 'pages/*.html'
        },
        web: {
          pattern: 'projects/websites/*.html'
        },
        blackberry: {
          pattern: 'projects/blackberry/*.html'
        },
        webapps: {
          pattern: 'projects/webapps/*.html'
        }
    }))
    .use(branch('pages/*.html')
      .use(permalinks({
        pattern: ":title"
      }))
    )
    .use(branch('projects/**/*.html')
      .use(permalinks({
        pattern: "portfolio/:collection/:title"
      }))
    )
    .use(layouts({
      engine: 'handlebars',
    }))
    .use(pathname)
    .destination('build')
    .use(serve({
      port: 3000,
      host: '0.0.0.0'
    }))
    // .use(watch({
    //   paths: {
    //     "${source}/**/*": true,
    //     'layouts/**/*.hbs': '**/*'
    //   },
    //   livereload: true,
    // }))
    .build(function (err) {
      if (err) console.log(err);
    });


    function pathname (files, metalsmith, done) {
      console.log(collections.pages);
      for (var file in files) {
        console.log(files[file].title + " | " + files[file].path);
      }
      done();
    }

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname ==='/') { // When id is "undefined"
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          /*
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);  // filelist 출력
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`); // template 출력

          response.writeHead(200);
          response.end(template);
          */

          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);  // filelist 출력
          var html = template.html(title, list, `<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`); // template 출력

          response.writeHead(200);
          response.end(html);
        });

      } else { // When id is "not undefined"
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags: [ 'h1' ]
            });
            var list = template.list(filelist);  // filelist 출력
            var html = template.html(title, list,
              `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
              `<a href="/create">create</a>
               <a href="/update?id=${sanitizedTitle}">update</a>
               <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
               </form>
               `); // template 출력

            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'WEB - create';
          var list = template.list(filelist);  // filelist 출력
          var html = template.html(title, list, `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                  <textarea rows="8" cols="80" name="description" placeholder="description"></textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
            </form>
          `,
          ''
        ); // template 출력

          response.writeHead(200);
          response.end(html);
        });
      }
    } else if(pathname === '/create_process'){
      var body = '';

      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        console.log(post);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);  // filelist 출력
          var html = template.html(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                  <textarea rows="8" cols="80" name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?=id=${title}">update</a>`
          ); // template 출력
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';

      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;

        var filteredId = path.parse(id).base;
        fs.rename(`data/${filteredId}`, `data/${title}`, function(){
          var fs = require('fs')
          fs.writeFile(`data/${filteredId}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }

    //console.log(__dirname + _url)
    //response.end(fs.readFileSync(__dirname + _url));
    //response.end('cellularhacker : ' + url);

});
app.listen(3000);

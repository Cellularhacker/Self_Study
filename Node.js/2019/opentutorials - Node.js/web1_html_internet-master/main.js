var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';

  return list;
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname ==='/') { // When id is "undefined"
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);  // filelist 출력
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`); // template 출력

          response.writeHead(200);
          response.end(template);
        });

      } else { // When id is "not undefined"
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          fs.readdir('./data', function(error, filelist){
            var title = queryData.id;
            var list = templateList(filelist);  // filelist 출력
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`); // template 출력

            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'WEB - create';
          var list = templateList(filelist);  // filelist 출력
          var template = templateHTML(title, list, `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                  <textarea rows="8" cols="80" name="description" placeholder="description"></textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
            </form>
          `); // template 출력

          response.writeHead(200);
          response.end(template);
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
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        fs.readdir('./data', function(error, filelist){
          var title = queryData.id;
          var list = templateList(filelist);  // filelist 출력
          var template = templateHTML(title, list,
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
            `<a href="/create">create</a> <a href="/update?=id=${title}">update</a>`); // template 출력

          response.writeHead(200);
          response.end(template);
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

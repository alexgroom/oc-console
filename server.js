var cc       = require('config-multipaas'),
    finalhandler= require('finalhandler'),
    http     = require("http"),
    Router       = require('router'),
    bodyParser   = require('body-parser'),
    fs = require('fs'),
    serveStatic       = require("serve-static");

var oc = require('./modules/oc')

var config   = cc();
var app      = Router()

app.use(serveStatic('static'))

app.get("/status", function(req,res) {
  res.statusCode = 200
  res.setHeader('Content-Type','application/json; charset=utf-8')
  res.end("{status: 'ok'}\n")
})


function home_page(req,res) {
  
  var index = fs.readFileSync(__dirname + '/index.html')
  res.statusCode = 200
  res.setHeader('Content-Type','text/html; charset=utf-8')
  res.end(index.toString())
}

var api = Router()
app.use('/', api)

api.use(bodyParser.urlencoded())

api.get("/", home_page )

api.post("/", function(req,res) {

  if (req.body.command) {
    res.statusCode = 200
    res.setHeader('Content-Type','text/html; charset=utf-8')

    res.write("<html><head><title>Online OC</title></head><body>")
    var ret = oc.run_command(req.body.command,function(err,out,err){

      res.write("<h1>Response</h1>")
      res.write("<code>" + out + "</code>")
      res.write("<h3>Info</h3>")
      res.write("<code>" + err + "</code>")
      res.write("<br />")

    })

    res.end('<a href="/">Again</a></body></html>')

  } else {
    console.log("body value null")
    home_page(req,res)
  }

})

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  app(req, res, done)
});

server.listen(config.get('PORT'),config.get('IP'),function() {
  console.log( "Listening on " + config.get('IP') +":" + config.get('PORT') )
});

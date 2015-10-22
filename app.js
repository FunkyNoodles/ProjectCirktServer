var express = require('express');
var http = require('http');
var fs = require("fs");
var xmldoc = require("xmldoc");
var path = require("path");
var parseString = require('xml2js').parseString;
var app = express();

const PORT = 8080;

app.get('/', function (req, req) {
    req.send("This local host is for testing Node JS");
});

var xml = 5;
xml = fs.readFile(__dirname + '/schedule.xml', 'utf8', function (err, data) {
    if (err) throw err;
    //console.log(data.toString());
});

xml = (fs.readFileSync("./schedule.xml"));
xml = xml.toString();
//console.log(xml.toString());
newXML(xml);

var server = app.listen(PORT, function () {
    console.log("\n\nServer listening on: http://localhost:%s", PORT);
});

function downloadXML(fileString) {
    var rootURL = 'http://courses.illinois.edu/cisapp/explorer/schedule.xml';
    var fileString = rootURL.substr(rootURL.indexOf('schedule'));
    var file = fs.createWriteStream(fileString);
    http.get(rootURL, function (response) {
        response.pipe(file);
    });
}

function newXML(xml) {
    ///var newLink = attr;
    var document = new xmldoc.XmlDocument(xml);
    //var newLink = document.calendarYearsNode.valueWithPath("calendarYear@href");
    //var newLink = document.calendarYearsNode.children[0].attr.href;
    for (i = 0; i < document.childNamed("calendarYears").children.length; i++) {
        console.log(document.childNamed("calendarYears").children[i].attr.href);
    }
}
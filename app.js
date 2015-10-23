var express = require('express');
var http = require('http');
var fs = require("graceful-fs");
var xmldoc = require("xmldoc");
var path = require("path");
var mkdirp = require('mkdirp');
var parseString = require('xml2js').parseString;
var app = express();

const PORT = 8080;

var rootURL = 'http://courses.illinois.edu/cisapp/explorer/schedule.xml';
var baseURL = 'http://courses.illinois.edu/cisapp/explorer';

app.get('/', function (req, req) {
    req.send("This local host is for testing Node JS");
});

var xml;

xml = (fs.readFileSync("./schedule.xml"));
xml = xml.toString();
//console.log(xml.toString());
newXML(xml, "calendarYears");

var server = app.listen(PORT, function () {
    console.log("\n\nServer listening on: http://localhost:%s", PORT);
});

function downloadXML(urlString) {
    var fileString = urlString.substr(urlString.indexOf('schedule'));
    fileString = "./" + fileString;
    var slashCount = (fileString.match(/\//ig) || []).length;
    var dir = "./" + urlString.substring(urlString.indexOf('schedule'), urlString.lastIndexOf('/'));
    console.log(fileString + "  " + dir + "   " + slashCount);
    //console.log(baseURL + fileString.substr(1));
    mkdirp(dir, function (err) {
    });
    var file = fs.createWriteStream(fileString);
    http.get(urlString, function (response) {
        response.pipe(file);
    });
    var xmlParsed;

    file.on('finish', function(){
        //file.end();
        //xmlParsed = fs.readFileSync(fileString);
    });

    fs.readFile(fileString, function (err, data) {
        if (err) {
            return console.error(err);
        }

        setTimeout(function () {
            xmlParsed = data.toString();
        }, 1000);
    });

    setTimeout(function () {
        if (xmlParsed == null) {
            return;
        }
        switch (slashCount) {
            case 2:
                newXML(xmlParsed, "terms");
                break;
            case 3:
                newXML(xmlParsed, "subjects");
                break;
            case 4:
                newXML(xmlParsed, "courses");
                break;
            case 5:
                newXML(xmlParsed, "sections");
                break;
            default:
                console.log("Errrrrrrrrrrrrrrrrrrrrrrr");
        }
    }, 1000);
}

function newXML(xml,tagName) {
    var document = new xmldoc.XmlDocument(xml);
    var urlString;
    for (i = 0; i < document.childNamed(tagName).children.length; i++) {
        urlString = document.childNamed(tagName).children[i].attr.href;
        setTimeout(callDownload(urlString), 1000);
    }
}

function callDownload(urlString) {
    //console.log("Hit " + urlString);
    downloadXML(urlString);
}

function callReadFile (fileString){
    var xmlParsed = fs.readFileSync(fileString);
    return xmlParsed;
}
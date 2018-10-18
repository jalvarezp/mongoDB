var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();
var databaseUrl = "scraper";
var collections = ["scrapedData"];


var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


app.get("/", function(req, res) {
  res.send("/scrape for scrape data and /all to see the scrape data");
});

app.get("/all", function(req, res) {

  db.screepdata.find({}, function(error, found) {

    if (error) {
      console.log(error);
    }

    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res) {
  request("https://www.soriana.com/", function(error, response, html) {


    var $ = cheerio.load(html);

    $("div.carousel__item").each(function(i, element) {
  
      var price = $(element).children().find(".price").text();
      price.replace("\n", "");
      price.replace("\t", "");
      var name = $(element).find(".carousel__item--name").text();
  

      db.screepdata.insert({"price": price,"name": name});
    });

  });
});
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
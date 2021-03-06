const axios = require('axios');
const cheerio = require("cheerio");
const mongoose = require("mongoose");
// Require all models
const db = require("../models");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytscraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function (app) {
    // A GET route for scraping the NYT website
    app.get("/scrape", function (req, res) {
        // Grab the body of the html with axios
        axios.get("https://www.nytimes.com/").then(function (response) {
            // Load all that data into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // Now, we grab every h2 within an article tag, and do the following:
            $("article").each(function (i, element) {
                // Save an empty result object
                var result = [];
                // Add the text and href of every link, and save them as properties of the result object
                var headline = $(this).find("H2").text().trim();
                var summary = $(this).find("p").text().trim();
                if (summary === "") {
                    summary = "*** No article summary available ***";
                }
                var link = $(this).find("a").attr();
                var newLink = "https://www.nytimes.com" + link.href;
                var post = {
                    headline: headline,
                    summary: summary,
                    link: newLink
                };
                result.push(post);
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
            res.send("Scrape Complete");
            // Send a message to the client
        });
    });

    // clear all articles from database
    app.get("/clearScrape", function (req, res) {
        console.log(req.body)
        db.Article.deleteMany({ saved:false})
            .then(function (dbArticle) {
                // res.json(dbArticle);
                res.render("/");
            })
            .catch(function (err) {
                res.json(err);
            });
        res.send(true)
    });
    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab five documents from the Articles collection
        // need to find a way to grab articles 0 - 4 on first load, then prepend 5-9, then 10-14, etc.
        console.log("here's the starting point");
        db.Article.find({ saved:false})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                // res.json(dbArticle);
                console.log(dbArticle);
                var articleHolding = [];
                for (i = 0; i < 5; i++) {
                    articleHolding.push(dbArticle[i]);
                    console.log(dbArticle[i]);
                }
                hbsObject = {
                    Articles: articleHolding
                };
                console.log(hbsObject);
                res.render("index", hbsObject)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for getting saved articles from the db
    app.get("/savedArticles", function (req, res) {
        // Grab five documents from the Articles collection
        // need to find a way to grab articles 0 - 4 on first load, then prepend 5-9, then 10-14, etc.
        db.Article.find({ saved: true })
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                // res.json(dbArticle);
                console.log(dbArticle);
                hbsObject = {
                    Articles: dbArticle
                };
                res.render("saved", hbsObject)
                // res.json(hbsObject)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

    // Route for grabbing a specific Article by id, populate it with its note
    app.get("/articleNote/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // Route for saving a specific Article by id
    app.put("/articleSave/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.updateOne(
            { _id: req.params.id },
            { $set: { saved: true } }
        )
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                console.log(dbArticle)
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for unsaving a specific Article by id
    app.put("/articleUnsave/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.updateOne(
            { _id: req.params.id },
            { $set: { saved: false } }
        )
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                console.log(dbArticle)
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
          // ..and populate all of the notes associated with it
          .populate("note")
          .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
      
    // Route for saving/updating an Article's associated Note
    app.post("articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // clear all articles from database
    app.get("/api/clear", function (req, res) {
        console.log(req.body)
        db.Article.deleteMany({}, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                res.send(true)
            }
        })
    });
}
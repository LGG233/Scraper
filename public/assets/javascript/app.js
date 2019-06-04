$(document).ready(function () {
    $('#scrape-articles').click(function () {
        event.preventDefault();
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "scrape",
            dataType: "json",
            type: "GET"
        }).then(function (response) {
            $("#scrape-success").text("Scrape was successful. 'Load Articles' to begin.")
            // console.log("this is the response from the back end:")
            // console.log(response);
        })
    });

    $('.save-article').click(function () {
        event.preventDefault();
        var _id = $(this).data("id");
        console.log(_id);
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "articleSave/" + _id,
            dataType: "json",
            type: "PUT"
        }).then(function (response) {
            console.log(response);
        })
    });

    $('.remove-article').click(function () {
        console.log("clicked!");
        event.preventDefault();
        var _id = $(this).data("id");
        console.log(_id);
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "articleUnsave/" + _id,
            dataType: "json",
            type: "PUT"
        }).then(function (response) {
            console.log(response);
            getSaved();
        })
    });

    $('#clear-articles').click(function () {
        event.preventDefault();
        $("#article-list").empty();
        $("#article-list").html("<h3>Load more articles to continue...</h3>");
    });

    $('#load-articles').click(function () {
        // var articlesShown = $(this).data("totalArticles "); - how to load more when div is not cleared?
        event.preventDefault();
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "articles/",
            dataType: "json",
            type: "GET"
        }).then(function (response) {
            console.log("this is the response from the back end:")
            console.log(response);
        });
    });

    $('#save-note').click(function () {
        event.preventDefault();
        $('#write-note-modal').modal('show');
    });

    $('#delete-note').click(function () {
        event.preventDefault();
    });

    $('#saved-articles').click(function () {
        event.preventDefault();
        getSaved();
    });

    $('#go-home').click(function () {
        // should this just be a link to the home page? What is on the "home" page?
        event.preventDefault();
    });

    $('#write-note').click(function () {
        event.preventDefault();
        $('#write-note-modal').modal('show');
    });

    // will also need a button attached to each note that allows deletion of specific note
});

function getSaved() {
    $("#article-list").empty();
    $.ajax({
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        url: "savedArticles/",
        dataType: "json",
        type: "GET"
    }).then(function (response) {
        for (i = 0; i < response.Articles.length; i++) {
            console.log("this is the number of saved articles: " + response.Articles.length)
            var headline = response.Articles[i].headline;
            var link = response.Articles[i].link;
            var summary = response.Articles[i].summary;
            var id = response.Articles[i]._id;
            console.log("Headline: " + headline);
            console.log("link: " + link);
            console.log("Summary: " + summary);
            console.log("ID: " + id);
            var articleDiv = $("<div class='card-header'>");
            var removeButton = $("<button class='btn btn-outline-secondary remove-article' data-id='" + id + "'>").text("Remove Article");
            var artHeadline = $("<h5>").html(headline);
            var artLink = $("<a href='" + link + "'>").html(artHeadline);
            var artSummary = $("<p class='card-body summary-text'>").html(summary);
            articleDiv.append(removeButton);
            articleDiv.append(artLink);
            articleDiv.append(artSummary);
            var articleWrapper = $("<div class='card'>").html(articleDiv);
            $("#article-list").append(articleWrapper);
        }
    })
};

$(document).ready(function () {
    // buttons that contain api calls
    $('#scrape-articles').click(function () {
        console.log("scrape started");
        event.preventDefault();
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "scrape",
            type: "GET"
        }).then(function (response) {
            alert("Scrape was successful. 'Load Articles' to begin.")
        })
    });

    $('#clear-scrape').click(function () {
        event.preventDefault();
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "clearScrape",
            type: "GET"
        }).then(function (response) {
            alert("Click 'Scrape Again' to grab new headlines, then 'Load Articles' to see results.")
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
            window.location.assign("/articles")
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
            window.location.assign("/savedArticles")
        })
    });

    $('#save-note').click(function () {
        event.preventDefault();
    });

    $('#delete-note').click(function () {
        event.preventDefault();
    });

    // buttons that call new views
    $('#clear-articles').click(function () {
        event.preventDefault();
        $("#article-list").empty();
        $("#article-list").html("<h1>Load more articles to continue...</h1>");
    });

    $('#load-articles').click(function () {
        event.preventDefault();
        window.location.assign("/articles")
    });

    $('#saved-articles').click(function () {
        event.preventDefault();
        window.location.assign("/savedArticles")
    });

    $('#write-note').click(function () {
        event.preventDefault();
        $('#write-note-modal').modal('show');
    });

    $('#go-home').click(function () {
        event.preventDefault();
        window.location.assign("/")
    });

    // will also need a button attached to each note that allows deletion of specific note
});


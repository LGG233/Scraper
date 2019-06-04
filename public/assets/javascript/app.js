$(document).ready(function () {
    $("#note-input").hide();
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

    $('.write-note').click(function () {
        event.preventDefault();
        console.log("write note modal clicked");
        var _id = $(this).data("id");
        console.log(_id);
        $.ajax({
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            url: "articleNote/" + _id,
            dataType: "json",
            type: "GET"
        })
        .then(function(data){
            console.log(data)
            var headline = data.headline;
            console.log(headline);
            var summary = data.summary;
            var _id = data._id;
            $('#write-note-modal #modal-title').val("Notes for " + headline);
            $('#write-note-modal #modal-summary').val(summary);
            $('#write-note-model #data-id').val(_id)
            $('#write-note-modal').modal('show');
        })
    });

    $('#save-note').click(function (_id) {
        var _id = $(this).data("id");
        console.log(_id);
        event.preventDefault();
        // Grab the id associated with the article from the submit button
        // $('#write-note-modal').modal('hide');
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "articles/" + _id,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#titleinput").empty();
            $("#bodyinput").empty();
        });
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

    $('#go-home').click(function () {
        event.preventDefault();
        window.location.assign("/")
    });

    // will also need a button attached to each note that allows deletion of specific note
});


$(document).ready(function () {
    $('#new-scrape-btn').click(function () {
        event.preventDefault();
        $('#new-chore-modal').modal('show');
    });

    $('#edit-chore-btn').click(function () {
        event.preventDefault();
        $('#edit-chore-modal').modal('show');
    });
});

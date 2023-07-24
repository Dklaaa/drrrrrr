function showLoader(text) {
    $(".loader-text").text(text);
    $(".loader-wrapper")
        .css("visibility", "visible")
        .css("opacity", 1).fadeIn();
}

function hideLoader() {
    $(".loader-wrapper").animate(
        {
            opacity: "0"
        },
        1000,
        function () {
            setTimeout(function () {
                $(".loader-wrapper")
                    .css("visibility", "hidden")
            }, 400);
        }
    );
}

require("./lib/magic.vue.js");

$(function() {
    $$.when("/index", function() {
        require(["../page/index"], loadView);
    })

    .init();
})
require("./style.scss");

module.exports = {
    template: require("./template.html"),
    data: {

    },

    methods: {
        pullRefresh: function(event) {
            console.log("pullRefresh has run!")
        }
    }
}
require("./style.scss");

module.exports = {
    template: require("./template.html"),
    data: {

    },

    methods: {
        pullDown: function(event) {
            console.log("pullDown has run!")
        },

        pullUp: function(event) {
            console.log("pullUp has run!")
        },
    }
}
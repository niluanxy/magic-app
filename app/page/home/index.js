require("./style.css");

module.exports = {
    template: require("./template.html"),
    
    data: {
        modal: null,
        title: "home test",  
    },

    resolve: function(params, defer) {
        var that = this;

        console.log(that)
        setTimeout(function() {
            console.log("has run setTimeout")
            console.log(that)
            console.log(params)
            that.title = "test resolve";

        }, 1000);
    },

    methods: {
        pullDown: function(finish) {
            console.log("pullDown has run!")
            setTimeout(function() {
                finish.done();
            }, 600)
        },

        pullUp: function(finish) {
            console.log("pullUp has run!")
            setTimeout(function() {
                finish.done();
            }, 600)
        },
    }
}
require("./style.css");

module.exports = {
    template: require("./template.html"),
    
    data: {
        modal: null,
        title: "首页的信息",  
    },

    resolve: function(para, defer) {
        setTimeout(function() {
            console.log("has load")
            defer.resolve()
        }, 130);
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
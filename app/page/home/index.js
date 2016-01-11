module.exports = {
    style: require("./style.css"),
    template: require("./template.html"),

    data: {
        modal: null,
        view : null,
        title: "首页的信息",
    },

    resolve: function(para, defer) {
        setTimeout(function() {
            defer.resolve()
        }, 330);
    },

    methods: {
        alert: function() {
            alert(this.modal.view.input)
        },

        showUser: function() {
            console.log("has test modal page")
            this.modal.toggle();
        },

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
    },

    events: {
        "hook:ready": function() {
            console.log("home page has create")
        }
    }
}
module.exports = {
	style: require("./style.css"),
    template: require("./template.html"),

    data: {
    	input: "abc"
    },

    events: {
    	"hook:ready": function() {
    		console.log('user page has create')
    	}
    }
}
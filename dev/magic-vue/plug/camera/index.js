module.exports = (function() {
    var _camera = $$.camera = {},
        camera  = navigator.camera,
        destype = camera.DestinationType,
        picsouce= camera.PictureSourceType,
        platform= $$.plug.platform;

    _camera.getPicture = function(success, fail) {
        if (platform == 'android'){
            camera.getPicture(success, fail, {
                quality: 50,
                 // allowEdit : false,
                destinationType: destype.DATA_URL,
                sourceType: picsouce.SAVEDPHOTOALBUM
            });
        } else if (platform == 'ios'){
            camera.getPicture(success, fail, {
                quality: 50,
                destinationType: destype.FILE_URI,
                sourceType: picsouce.SAVEDPHOTOALBUM
            });
        }
    }
})();
function Main_Application() {
    this.construct();
};

Main_Application.prototype = {

    construct : function() {
        this.init_api();
    },

    init_api : function() {

    }

};

var $Main_Application;

$( document ).ready(
    function() {
        $Main_Application = new Main_Application();
    }
);
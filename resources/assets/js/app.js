function Main_Application() {
    this.construct();
};

Main_Application.prototype = {

    construct : function() {
        this.init_form();
    },

    init_form : function() {
        $Site.form(
            'form[name=reviews-form]',
            {},
            function( $json_response ) {
                if( $json_response.success ) {

                    if( $API_Results ) {
                        $API_Results.construct();
                    } else {
                        $API_Results = new API_Results();
                    }

                }
            }
        );
    }

};

var $Main_Application;

$( document ).ready(
    function() {
        $Main_Application = new Main_Application();
    }
);
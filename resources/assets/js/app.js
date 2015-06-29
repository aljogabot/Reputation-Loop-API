function Main_Application() {
    this.construct();
};

Main_Application.prototype = {

    construct : function() {
        this.init_form();
        this.init_pagination_links();
    },

    init_form : function() {
        var $self = this;
        var $form = 'form[name=reviews-form]';

        $Site.form(
            $form,
            {},
            function( $json_response ) {
                if( $json_response.success ) {
                    if( $json_response.paginate ) {
                        $( '#reviews-container' ).html( $json_response.content );
                        $( '#paginate').val( '' );
                    } else {
                        $( '#review-results-container' ).html( $json_response.content );
                        $self.init_pagination_links();
                    }
                    $( $form ).find( 'input[name=page]' ).val( '1' );
                }
            }
        );
    },

    init_pagination_links : function() {

        $( 'ul.pagination-lg' ).on(
            'click',
            'a',
            function( $e ) {

                $e.preventDefault();

                $( this ).closest( 'ul' ).find( 'li' ).removeClass( 'active' );
                $( this ).parent().addClass( 'active' );

                var $page = $( this ).attr( 'href' ).slice( -1 )//.replace( '/?page=' );
                $page = $page ? $page : 1;

                var $form = $( 'form[name=reviews-form]' );

                $form.find( 'input[name=page]' ).val( $page );
                $form.find( '#paginate' ).val( '1' );
                $form.trigger( 'submit' );

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
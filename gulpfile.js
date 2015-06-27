var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(
    function( mix ) {

        mix.copy( 'resources/assets/bower/bootswatch/bootstrap.flatly.css', 'resources/assets/css/bootstrap.flatly.css' );
        mix.copy( 'resources/assets/bower/bootswatch/bootstrap.flatly.css', 'resources/assets/css/bootstrap.flatly.css' );
        mix.copy( 'resources/assets/bower/jquery/dist/jquery.js', 'resources/assets/js/jquery.js' );

        mix.styles(
            [
                'bootstrap.css'
            ],
            'public/css/app-all.css'
        );

        mix.scripts(
            [
                'jquery.js',
                'app.js'
            ],
            'public/js/app-all.js'
        );

        mix.version( [ 'public/css/app-all.css', 'public/js/app-all.js' ] );
    }
);

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Reputation Loop API</title>

        <!-- Stylesheets -->
        <link rel="stylesheet" href="{{ elixir( 'css/app-all.css' ) }}"/>
    </head>
    <body>

        <div class="container">

            <!-- Navigation Container -->
            <div class="row">
                @include( 'blocks/navigation' )
            </div>
            <!-- End Navigation Container -->

            <div class="row">
                <div class="col-lg-12">
                    <h1>@yield( 'page-title' )</h1>
                </div>
            </div>

            <hr />

            @yield( 'content' )

        </div>

        <!-- There is no reason to put this on a separate view as it is minified :) -->
        <script type="text/javascript" src="{{ elixir( 'js/app-all.js' ) }}"></script>
    </body>
</html>
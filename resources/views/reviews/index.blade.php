@extends( 'app' )
@section( 'page-title', 'Business Information' )

@section( 'content' )
    <div class="row">
        <div class="col-lg-12">
            <h2>
                {{ $businessInfo[ 'busine' ] }}
            </h2>
        </div>
    </div>

    <hr />

    <div class="row">
        <div class="col-lg-12">
            <h1>Reviews</h1>
        </div>
    </div>

    <hr />

    <div class="row">
        <div class="col-lg-6">
            <div class="well bs-component">
                <form name="reviews-form" method="POST">
                    <fieldset>
                        <legend>Review Options</legend>
                        <div class="form-group">
                            <label class="control-label" for="select">Number of Reviews</label>
                            <select id="select" class="form-control">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Sources</label>
                            <div class="radio">
                                <label>
                                    <input type="checkbox" value="internal" name="sources[]">
                                    Internal
                                </label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input type="checkbox" value="yelp" name="sources[]">
                                    Yelp
                                </label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input type="checkbox" value="google" name="sources[]">
                                    Google
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary btn-block" type="submit">Submit</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>

        <div class="col-lg-6" id="review-results-container">
            @include( 'reviews/results' )
        </div>
    </div>
@endsection
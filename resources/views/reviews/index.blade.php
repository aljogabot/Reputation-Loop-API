@extends( 'app' )
@section( 'page-title', 'Business Information' )

@section( 'content' )
    <div class="row">
        <div class="col-lg-12">
            <h2>
                {{ $business->name() }}
            </h2>
            <p>
                {!! $business->address() !!}
            </p>
            <p>
                {{ $business->phone() }}
            </p>
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
                    <div class="alert" id="alert-message-box"></div>

                    <fieldset>
                        <legend>Review Options</legend>
                        <div class="form-group">
                            <label class="control-label" for="select">Number of Reviews</label>
                            <select id="select" name="noOfReviews" class="form-control">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Sources</label>
                            <div class="radio">
                                <label>
                                    <input type="checkbox" checked value="internal=1" name="sources[]">
                                    Internal
                                </label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input type="checkbox" checked value="yelp=1" name="sources[]">
                                    Yelp
                                </label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input type="checkbox" checked value="google=1" name="sources[]">
                                    Google
                                </label>
                            </div>
                            <input type="hidden" id="sources" />
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary btn-block" type="submit">Submit</button>
                        </div>
                        <input type="hidden" value="{{ csrf_token() }}" name="_token" />
                        <input type="hidden" value="1" name="page" />
                        <input type="hidden" value="0" id="paginate" name="paginate" />
                    </fieldset>
                </form>
            </div>
        </div>

        <div class="col-lg-6" id="review-results-container">
            @include( 'reviews/results' )
        </div>
    </div>
@endsection
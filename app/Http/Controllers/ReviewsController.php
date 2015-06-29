<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Http\Requests\APIRequest;
use Illuminate\Pagination\Paginator;
use ReputationLoop\Json;
use ReputationLoop\Repositories\BusinessRepository;
use ReputationLoop\Services\APIService;

class ReviewsController extends Controller
{

    public function __construct( APIService $api ) {
        $this->api = $api;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
        $business = $this->api
                         ->setSources()
                         ->fetch();

        return view( 'reviews/index', [ 'business' => $business ] );

    }


    /**
     * Process the request
     *
     * @return Json response
     */
    public function process( APIRequest $request, Json $json )
    {

        $page = $request->input( 'page' );

        $business = $this->api
                            ->set( 'noOfReviews', $request->input( 'noOfReviews' ) )
                            ->setSources( $request->input( 'sources' ) )
                            ->setOffset( $page )
                            ->fetch();

        $business->setPage( $page );

        if( $request->input( 'paginate' ) == '1' ) {

            $view = 'reviews.reviews';
            $json->set( 'paginate', TRUE );

        } else {

            $view = 'reviews.results';

        }

        $content = \View::make( $view, [ 'business' => $business ] )
                         ->render();

        $json->set( 'content', $content );

        return $json->success( 'Retrieved Successfully ...' )->render();

    }


}

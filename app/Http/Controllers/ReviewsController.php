<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Http\Requests\APIRequest;
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
        $business = $this->api->fetch();

        return view( 'reviews/index', [ 'business' => $business ] );

    }


    /**
     * Process the request
     *
     * @return Json response
     */
    public function process( APIRequest $request ) {

        $parameters = $request->all();

        $data = $this->api
                     ->params( $parameters )
                     ->fetch();



    }


}

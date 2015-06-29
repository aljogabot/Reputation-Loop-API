<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Http\Requests\APIRequest;
use ReputationLoop\Services\APIService;

class ReviewsController extends Controller
{

    public function __construct( APIService $api ) {
        $this->api = $api;
        $this->config = config( 'api.settings' );
        $this->api->setDefaults( $this->config );
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
        $data = $this->api->fetch();

        return view( 'reviews/index', [ 'data' => $data ] );

    }


    /**
     * Process the request
     *
     * @return Json response
     */
    public function process( APIRequest $request, APIService $api_service ) {

        $parameters = $request->all();

        $data = $this->api
                     ->params( $parameters )
                     ->fetch();



    }


}

<?php

    namespace ReputationLoop\Services;

    use ReputationLoop\Repositories\BusinessRepository;

    /**
     * Class APIService
     * @package ReputationLoop\Services
     */
    class APIService {

        protected $url;
        protected $apiKey;
        protected $params = array();
        protected $config;

        protected $businessRepository;

        public function __construct( BusinessRepository $businessRepository ) {
            $this->config = config( 'api.settings' );
            $this->setDefaults( $this->config );
            $this->businessRepository = $businessRepository;
        }

        /**
         * @param array $config
         * @return $this
         */
        public function setDefaults( array $config ) {
            $this->setURL( $config[ 'url' ] )
                 ->setAPIKey( $config[ 'apiKey' ] )
                 ->defaultParams( $config[ 'defaults' ] );

            return $this;
        }

        public function setSources( $sources = array() ) {

            if( empty( $sources ) ) {
                $sources = $this->config[ 'sources' ];
            }

            $this->params[] = $sources;

            return $this;

        }

        /**
         * @param $url
         * @return $this
         */
        public function setURL( $url ) {
            $this->url = $url;
            return $this;
        }

        /**
         * @param $apiKey
         * @return $this
         */
        public function setAPIKey( $apiKey ) {
            $this->apiKey = 'apiKey=' . $apiKey;
            return $this;
        }

        /**
         * @param array $params
         * @return $this
         */
        public function defaultParams( array $params ) {
            $this->params = $params;
            return $this;
        }

        /**
         * @param $key
         * @param $value
         * @return $this
         */
        public function set( $key, $value ) {
            $this->params[ $key ] = $value;
            return $this;
        }

        public function setOffset( $page ) {
            $offset = ( $page - 1 ) * $this->params[ 'noOfReviews' ];
            return $this->set( 'offset', $offset );
        }


        /**
         * @return $this
         */
        public function fetch() {

            $data = json_decode(
                file_get_contents( $this->url . $this->apiKey . '&' . http_build_query( $this->params ) )
            );

            return $this->businessRepository->init( $data, $this->params );

        }

    }
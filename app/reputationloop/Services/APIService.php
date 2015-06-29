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

        public function __construct( BusinessRepository $businessRepository ) {
            $config = config( 'api.settings' );
            $this->setDefaults( $config );
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


        /**
         * @return $this
         */
        public function fetch() {

            $data = json_decode(
                file_get_contents( $this->url . $this->apiKey . '&' . http_build_query( $this->params ) )
            );

            dd( $data );

            return $this->businessRepository->init( $data );

        }

    }
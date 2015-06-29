<?php

    namespace ReputationLoop\Repositories;

    class BusinessRepository {

        protected $businessName;
        protected $businessAddress;
        protected $businessPhone;

        /**
         * @param $data
         * @return $this
         */
        public function init( $data ) {
            $this->businessName = $data[ 'business_name' ];
            $this->businessAddress = $data[ 'business_address' ];
            $this->businessPhone = $data[ 'business_phone' ];

            return $this;
        }

        public function businessName() {
            return ucwords( $this->businessName );
        }

        public function businessAddress() {
            return ucwords( $this->businessAddress );
        }

        public function businessPhone() {
            return ucwords( $this->businessPhone );
        }

    }
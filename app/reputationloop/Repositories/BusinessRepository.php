<?php

    namespace ReputationLoop\Repositories;

    use Illuminate\Pagination\LengthAwarePaginator as Paginator;

    class BusinessRepository {

        protected $name;
        protected $address;
        protected $phone;

        protected $reviews;
        protected $totalReviews;
        protected $noOfReviews;

        protected $page = 1;

        /**
         * @param $data
         * @return $this
         */
        public function init( $data, $request_parameters ) {

            //dd( $request_parameters );

            $business = $data->business_info;

            $this->name = $business->business_name;
            $this->address = $business->business_address;
            $this->phone = $business->business_phone;

            $this->totalReviews = $business->total_rating->total_no_of_reviews;
            $this->reviews = $data->reviews;

            $this->noOfReviews = $request_parameters[ 'noOfReviews' ];

            return $this;
        }

        public function name() {
            return ucwords( $this->name );
        }

        public function address() {
            return ucwords( $this->address );
        }

        public function phone() {
            return ucwords( $this->phone );
        }

        public function reviews() {
            return $this->reviews;
        }

        public function totalReviews() {
            return $this->totalReviews;
        }

        public function setPage( $page ) {
            $this->page = $page;
        }

        public function paginate() {
            return new Paginator( $this->totalReviews, $this->noOfReviews, $this->page );
        }

    }
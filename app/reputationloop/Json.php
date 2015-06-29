<?php

namespace ReputationLoop;

use Illuminate\Http\JsonResponse;

class Json {

    private $data = [
        'success' => FALSE
    ];

    public function set( $key, $value ) {

        $this->data[ $key ] = $value;
        return $this;

    }

    public function error_fields( $error_fields = [], $message = '' ) {

        $error_message = ! empty( $message ) ? $message
            : 'There are error(s) in your form.';

        $error_fields[ 'ajax_error_message' ] = $error_message;

        return new JsonResponse( $error_fields, 422 );

        $this->data[ 'status' ]     = FALSE;
        $this->data[ 'message' ]    = ! empty( $message ) ? $message
            : 'There are error(s) in your form.';

        foreach( $error_fields as $field => $errors ) {
            if( is_array( $errors ) ) {
                $errors = array_shift( $errors );
            }
            $error_fields[ $field ] = $errors;
        }

        $this->data[ 'field_errors' ] = $error_fields;

        return $this;

    }

    public function get( $key ) {

        return isset( $this->data[ $key ] ) ? $this->data[ $key ] : FALSE;

    }

    public function html_content( $element, $content ) {

        $this->set( 'html', $content );
        return $this;

    }

    public function render() {
        return response()->json(
            $this->data
        );
    }

    public function redirect( $url ) {
        $this->data[ 'redirect' ] = $url;
        return $this;
    }

    public function success( $message = '' ) {
        $this->data[ 'success' ] = TRUE;
        $this->data[ 'message' ] = $message;

        return $this;
    }

    public function error( $message = '' ) {
        $this->data[ 'success' ] = FALSE;
        $this->data[ 'message' ] = $message;

        return $this;
    }

    public function __destruct() {
        return $this->render();
    }

}
<?php

    return [

        'settings' => [

            'url'       => 'http://test.localfeedbackloop.com/api?',
            'apiKey'    => '61067f81f8cf7e4a1f673cd230216112',

            'defaults'  => [
                'noOfReviews' => '10',
                'offset' => 0,
                'threshold' => 1
            ],

            'sources' => [
                // Defaults
                'internal' => 1,
                'yelp' => 1,
                'google' => 1
            ]

        ]

    ];
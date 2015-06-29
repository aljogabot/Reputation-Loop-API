@foreach( $business->reviews() as $review )
    <tr>
        <td>{{ $review->customer_name }}</td>
        <td>{{ $review->rating }}</td>
        <td><a target="_blank" href="{{ $review->customer_url }}">Click here</a></td>
        <td>{{ $review->review_source }}</td>
    </tr>
@endforeach
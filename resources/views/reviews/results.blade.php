<div class="bs-component">
    <table class="table table-striped table-hover ">
        <thead>
            <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Customer URL</th>
                <th>Review Source</th>
            </tr>
        </thead>
        <tbody id="reviews-container">
            @include( 'reviews.reviews' )
        </tbody>
    </table>
    <div class="btn btn-primary btn-xs" id="source-button" style="display: none;">&lt; &gt;</div>
    <ul class="pagination pagination-lg">
        <?php echo $business->paginate()->render(); ?>
    </ul>
</div>
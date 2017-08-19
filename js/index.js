var timeoutID;
// function to run when press Enter or click the button
function doTheSearch() {
  //  $('.random').css('display','none');
   $('form').addClass('compact');


   var searchTerm = $('input').val();
   // empty the page before loading new result
   $('div.results').empty();

   // loading jsonp
   $.ajax({
      url:'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=' + searchTerm + '&srwhat=text&srinfo=totalhits&srprop=titlesnippet%7Csnippet',
      dataType: "jsonp",
      success: function(wikiData) {

          if ($('input').val() != '') {
            $('.border').addClass('grow');
            // if loading json successfully, do this:
            var totalHits = wikiData.query.searchinfo.totalhits;

            if (totalHits === 0) {
              // if there's no result matched, do this
              // $('form').removeClass('compact');
              $('.border').removeClass('grow');
              $('div.results').addClass('error').html("There's no match for " + searchTerm);
            } else {
              // if there is result, do this
              displayAsHtml(wikiData);
            }
          }
      },
      error: function() {
         // if cannot load json, do this
         alert ("There's a problem connecting to the server. Please refresh the page and try again.");
      }
   });

   function displayAsHtml(wikiData) {
      /* run each value in the query 'wikiData.query.search'
         i is for index of each object inside 'wikiData.query.search'
         val is the content inside each object 'wikiData.query.search'
         */
      $.each(wikiData.query.search, function(i, val){
         // replace space with _

           var url = val.title.replace(/\s/g, "_");
           if ($('div.results').hasClass('error')) {
             $('div.results').removeClass('error');
           }
           $('div.results').append(

              '<a class="item" href="https://en.wikipedia.org/wiki/' + url + '" target="_blank">' +
                  '<span class="title">' + val.title + '</span>' +
                  '<span class="desc">' + val.snippet + '</span>' +
              '</a>'

           );

      })
   }
}

$('input').on('input',function(e){
  e.preventDefault();
  clearTimeout(timeoutID);
  if ( $('input').val() == '' ) {
    $('form').removeClass('compact');
    $('.border').removeClass('grow');
    $('div.results').html('');
  }
  else {
    timeoutID = setTimeout(doTheSearch,700);
  }
});

$('input')
.on('focus',function(){
  $('.search').addClass('highlight');
})
.blur(function(){
  $('.search').removeClass('highlight');
});

$('form').on('submit',function(e) {
  e.preventDefault();
  if ( $('input').val() == '' ) {
    $('div.results').addClass('error').html('Please type something to search');
  }
  else {
    doTheSearch();
  }
});

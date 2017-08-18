// Action when press Enter
$("form").keypress(function(e){
   if (e.which == 13) {
      doTheSearch();
   }
});

// Action when click the button
$('button').on('click', function(e){
   e.preventDefault();
   doTheSearch();
});

// function to run when press Enter or click the button
function doTheSearch() {
   $('.random').css('display','none');
   $('form').addClass('compact');
   
   // wait for ajax call compeleted then get the height of the form
   $( document ).ajaxComplete(function() {
      var formHeight = $("form.compact").outerHeight();
      console.log(formHeight);
      $('.results').css('margin-top', formHeight + 20 );  
   });
     
   var searchTerm = $('input[type=search]').val();
   console.log(searchTerm);
   // empty the page before loading new result
   $('div.results').empty();
   
   // loading jsonp
   $.ajax({
      url:'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=' + searchTerm + '&srwhat=text&srinfo=totalhits&srprop=titlesnippet%7Csnippet',
      dataType: "jsonp",
      success: function(wikiData) {
         // if loading json successfully, do this:
         var totalHits = wikiData.query.searchinfo.totalhits;
         
         if (totalHits === 0) {
            // if there's no result matched, do this
            alert ("There's no match for " + searchTerm);
         } else {
            // if there is result, do this
            displayAsHtml(wikiData);   
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
         
         $('div.results').append('<div class="item"><div class="title"><a href="https://en.wikipedia.org/wiki/' + url + '" target="_blank">' + val.title + '</a></div><div class="desc">' + val.snippet + '</div></div>');
      })
   }
}


$(window).resize(function(){
   var formHeight = $("form.compact").outerHeight();
   console.log(formHeight);
   $('.results').css('margin-top', formHeight + 20 );
});
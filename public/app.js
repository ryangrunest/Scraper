// grab articles from db based on localstorage terms
console.log(localStorage.getItem('category'));
console.log(localStorage.getItem('criteria'));

if ( localStorage.getItem('category') != null ) {
  $.getJSON(`/articles/${localStorage.getItem('category')}/${localStorage.getItem('criteria')}`, data => {
    // append articles to page on load
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(`<p data-id='${data[i]._id}'>${data[i].title}<br /><a href="${data[i].link}"> Link to Ad</a><br /> ${data[i].price}</p>`);
    }
  });
}

// function for checking search category and storing them as correct search results for ajax request
checkCategory = category => {
  let searchCategory;
  if (category === null) {
    searchCategory = '';
  } else if (category === 'Motorycles') {
    searchCategory = 'mca';
  } else if (category === 'Furniture') {
    searchCategory = 'fua';
  } else if (category === 'Musical Instruments') {
    searchCategory = 'msa';
  }
  return searchCategory;
}

// ajax request for scraping craigslist
$('#srch-submit').on('click', () => {
  console.log('button clicked!');
  event.preventDefault();
  console.log($('#srch-category').val());
  const category = checkCategory($('#srch-category').val());
  const criteria = $('#srch-criteria').val();
  console.log(`category is ${category}`);
  console.log(criteria);

  // set localstorage values so when page reloads, ajax request gets search fields from db
  localStorage.setItem('category', category);
  localStorage.setItem('criteria', criteria);
  // console.log(category);

  $.ajax({
    method: 'GET',
    url: `/scrape/${category}/${criteria}`
  }).then(data => {
    console.log('retrieved data!');
    window.location.reload();
  })
});



// $(document).on('click', 'button', () => {


  // localStorage.setItem('term', event.target.id);
  // alert(event.target.id);
  // $.ajax({
  //   method: 'GET',
  //   url: '/scrape/' + event.target.id
  // })
  // .then(data => {
  //   window.location.reload();
  // })
// })


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  })
    // With that done, add the note information to the page
    .then(data => {
      // console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

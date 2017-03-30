import Store from './store.js'

export default function app() {
  //All of your code starts here
  const urlBlog = 'http://tiny-za-server.herokuapp.com/collections/dres-blog';
  let $blogView =
    $(`<div>
        <input id="blog-title" placeholder="title" type="text" name="" value=""><br>
        <textarea id="body-input" name="name" rows="8" cols="80"></textarea><br>
        <button id="submitBtn" type="button" name="button">Submit</button>
      </div>`);
  let submitBtn = $($blogView).find('#submitBtn');
  let $infoView =
    $(`<div>
      <h3>Give Me Your Info</h3>
      <input id="first-name" placeholder="First Name" type="text" name="" value=""><br>
      <input id="last-name" placeholder="Last Name" type="text" name="" value=""><br>
      <input id="phone-num" placeholder="Phone Number" type="text" name="" value=""><br>
      <input id="address" placeholder="Address" type="text" name="" value=""><br>
      <button id="info-submit" type="button" name="button">Submit Info</button>
    </div>`)
  let infoBtn = $($infoView).find('#info-submit');
  let $blogViewAll =
    $(`<div class="blog-view">
        <h3>Check Out These Blogs</h3>
        <div class="column-1">
          <ul class="link-list"></ul>
        </div>
        <div class="column-2"></div>
      </div>`);
  let $findUl = $($blogViewAll).find('.link-list');
  let $blogBody = $($blogViewAll).find('.column-2');
  var $findLi;

 // = $($blogViewAll).find('.link');


  let settings = {
  	type: 'GET',
  	dataType: 'json',
  	url: urlBlog
    };


//---------------Button Clicks---------------
  submitBtn.on('click', function(e){
    let $blogTitle = $($blogView).find('#blog-title').val();
    let $blogBody = $($blogView).find('#body-input').val();
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: urlBlog,
      data: JSON.stringify({
        title: $blogTitle,
        body: $blogBody
      })
    }).then(function(data, status, xhr){
      console.log(status);
    })

  })
  infoBtn.on('click', function(e){
    let $firstName = $($infoView).find('#first-name').val();
    let $lastName = $($infoView).find('#last-name').val();
    let $phoneNum = $($infoView).find('#phone-num').val();
    let $address = $($infoView).find('#address').val();
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: urlBlog,
      data: JSON.stringify({
        firstName: $firstName,
        lastName: $lastName,
        phoneNumber: $phoneNum,
        address: $address
      })
    }).then(function(data, status){
      let $nameDisplay = $(`<h3>Hello ${$firstName}!</h3>`);
      $('#app').append($nameDisplay);
      $($infoView).addClass('hide');
      console.log(status);
    })
  })
  $('#delete-all').on('click', function(e){
  	$.ajax(settings).then(function(data, status, xhr){
  		data.forEach(function(item, i, arr){
  			let id = item._id;
  			let url = `${urlBlog}/${id}`;
  			$.ajax({
  				type: 'DELETE',
  				url: url
  			})
  		})
  	})
  })

//---------------Get Links-------------------
  function getLinks (){
  let blogLinks;
  $.ajax(settings).then(function(data, status, xhr){
    data.forEach(function(item, i, arr){
      let id = item._id;
      if (item.title){
        blogLinks = `<li><a class="link" href=#${item.title}>${item.title}</a></li>`
        $($findUl).append(blogLinks);
      }
    })
  })
  // return $findLi = $(blogLinks).find('.link');
}


//----------------Display Link Content
//when link get's clicked, body needs to be displayed under $blogBody

$findUl.on('click','.link', function(e){
  var title = $(e.currentTarget).text();
  console.log(title);
});


//
// let bodyPost = function(){
//   $.ajax(settings).then(function(data, status, xhr){
//     data.forEach(function(item, i, arr){
//
//     })
//   })
// }







  //Example of the most minimal view possible.
  let defaultView = `<h1>Let's Blog!</h1>`

  //The default state of this app is nothing, just an empty object.
  //  Don't worry about adding state until you need to keep track of it across views.
  let initialState = {
  };

  const store = new Store(initialState);

  const update = function (state, event, data) {
    console.log(`Update was called because the '${event}' event was fired.`);
    if (state === undefined || event === undefined) {
      console.debug("Error: Something is undefined")
      console.debug(`State: ${state} | Event: '${event}'`);
      return;
    } else {
      // Your update code goes below here

      if (event === "hello_world") {
        console.log("hello world!");
        //Always return the state;
        return state;
      }

      // Your update code goes above here
      console.debug(`Unhandled Event: '${event}'`);
      return;
    }
  };

  const render = function (state, event, data) {
    // You will want to update this render function to render
    $('#app').html(defaultView);
    $('#app').append($blogView);
    $('#app').append($infoView);
    $('#app').append($blogViewAll);
    getLinks();

  };

  // Every time an event is fired the update function will run
  //  and *then* the render function will run after that.
  store.add(update);
  store.add(render);
  store.fire("hello_world"); // Feel free to delete. This is just an example.
}

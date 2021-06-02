
document.addEventListener("DOMContentLoaded", function(event) {

  console.log(new Date().toLocaleString());

  let response = null;
  let responseImg = null;
  let responseBookmarks = null;

  let type = null;
  /* Author search*/

  function postBookmark(url, obj) {
    obj = JSON.parse(obj)
    console.log(obj)
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    //.then(res => res.json())
  }

  function doFetchImage(url) {
    fetch(url, { 
      method: 'GET',
      headers: {
        'Accept': 'image/*'
      }
    }).then(function(response) {
      return response.json();
    })
    .then(function(text) {
      response = text;
      console.log('Request successful', text);
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
  }

  function doFetch(url) {
    fetch(url, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(function(response) {
      return response.json();
    })
    .then(function(text) {
      response = text;
      console.log('Request successful', text);
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
  }

  function doFetch2(url) {
    return fetch(url).then(function(response) {
        return response.json();
    }).then(function(json) {
        return json;
    });
  }


  //doFetch('https://reststop.randomhouse.com/resources/authors?firstName=Dan&lastName=Brown');

  const btn_author = document.getElementById("submit-author");
  const inp_author_name = document.getElementById("name");
  const inp_author_lastname = document.getElementById("lastname");
  btn_author.onclick = function() {
    console.log("fetch author");

    let firstName = inp_author_name.value;
    let lastName = inp_author_lastname.value;

    let url = `https://reststop.randomhouse.com/resources/authors?firstName=${firstName}&lastName=${lastName}`;

    type = 1;
    response = doFetch(url);
  };

  /* authorid */

  const btn_author_authorid = document.getElementById("submit-author-authorid");
  const inp_author_authorid = document.getElementById("author-authorid");
  btn_author_authorid.onclick = function() {
    console.log("fetch author authorid");

    let authorid = inp_author_authorid.value;

    let url = `https://reststop.randomhouse.com/resources/authors/${authorid}/`;

    type = 2;
    response = doFetch(url);
  };

  /* works */

  const btn_work = document.getElementById("submit-work");
  const inp_work_keyword = document.getElementById('work-keyword');
  btn_work.onclick = function() {
    console.log("fetch work");

    let keyword = inp_work_keyword.value;
    keyword.replace('', '%20');

    let url = `https://reststop.randomhouse.com/resources/works?keyword=${keyword}`;

    type = 3;
    response = doFetch(url);
  };

  /* workid */
  
  const btn_work_workid = document.getElementById("submit-work-workid");
  const inp_work_workid = document.getElementById("work-workid");
  btn_work_workid.onclick = function() {
    console.log("fetch work workid");

    let workid = inp_work_workid.value;

    let url = `https://reststop.randomhouse.com/resources/titles/${workid}/`;
    
    type = 4;
    response = doFetch(url);
  };

  /* title */

  const btn_title = document.getElementById("submit-title");
  const inp_title_keyword = document.getElementById("title-keyword");
  btn_title.onclick = function() {
    console.log("fetch titles");

    let keyword = inp_title_keyword.value;
    keyword.replace('', '%20');
    
    let url2 = `https://reststop.randomhouse.com/resources/titles?keyword=${keyword}`;
    let url = `https://reststop.randomhouse.com/resources/titles?start=0&max=10&expandLevel=0&onsaleStart=MM/dd/yyyy&onsaleEnd=MM/dd/yyyy&authorid=0&workid=0&keyword=${keyword}`;

    type = 5;
    response = doFetch(url);
  };

  /* isbn */

  const btn_title_isbn = document.getElementById("submit-title-isbn");
  const inp_title_isbn = document.getElementById("title-isbn");
  btn_title_isbn.onclick = function() {
    console.log("fetch titles isbn");

    let isbn = inp_title_isbn.value;

    let url = `https://reststop.randomhouse.com/resources/titles/${isbn}`;
    
    type = 6
    response = doFetch(url)

    //responseBookmarks = doFetch2('/bookmarks')
    doFetch2('/bookmarks').then(function(result) {
      console.log('/bookmarks ')
      console.log(result);
      responseBookmarks = result
    });
    //doFetchImage(url);
    
  };

  /* event */
  const btn_event = document.getElementById("submit-event");
  const inp_event_keyword = document.getElementById("event-keyword");
  btn_event.onclick = function() {
    console.log("fetch events");

    let keyword = inp_event_keyword
    .value;
    keyword.replace('', '%20');

    let url = `https://reststop.randomhouse.com/resources/authorevents?start=0&max=10`;

    response = doFetch(url);
    type = 7;
  };

  /* eventid */
  const btn_event_eventid = document.getElementById("submit-event-eventid");
  const inp_event_eventid = document.getElementById("event-eventid");
  btn_event_eventid.onclick = function() {
    console.log("fetch event eventid");

    let eventid = inp_event_eventid.value;

    let url = `https://reststop.randomhouse.com/resources/authorevents/${eventid}/`;

    response = doFetch(url);        
    type = 8;
  };

  const btn_showResponse = document.getElementById("showResponse");
  btn_showResponse.onclick = showResponse;

  function showResponse() {
    console.log('showResponse')
    if (type === 1) 
      createResults();
    else if (type === 6)
      createResultsISBN();
    console.log('showResponse end')
  }

  const resultsContainer = document.getElementById("results-container");

  function createResults() {
    console.log("Create results");
    clearResults();
    // console.log(response.author);
    
    for (let i = 0; i < (response.author).length; i++) {
      console.log((response.author)[i]);

      let el = (response.author)[i];

      let resultElement = document.createElement('div');
      resultElement.className = 'card';
      resultElement.id = el.authorid;
      // resultElement.title = name;
      // resultElement.setAttribute("onclick", "openViewExtended ('" + id + "', '" + name + "')");
      resultElement.innerHTML = 
      '<img src="/static/img_avatar.png" alt="Avatar" style="width:100%">' +
      '<div class="container">' +
        '<h4><b>' + el.authordisplay + '</b></h4>' + 
        '<p>' + el.authorid + '</p>' + 
      '</div>';
      resultsContainer.appendChild(resultElement);
    }
    console.log("Create results - finished");
  }

  function createResultsISBN() {
    console.log("Create results");
    clearResults();    

    let resultElement = document.createElement('div');
    resultElement.className = 'card';
    resultElement.id = response.isbn
    let ts = response.titleshort
    let aut = response.author
    let isbn = response.isbn

    let responseString = JSON.stringify(response)
    console.log(responseString)
    let found = false;
    try {
      for (let i = 0; i < responseBookmarks.bookmarks.length; i++) {
        console.log('isbn: ' + responseBookmarks.bookmarks[i].isbn)
        console.log('isbn2: ' + isbn)
        console.log(isbn == responseBookmarks.bookmarks[i].isbn)
        if (isbn == responseBookmarks.bookmarks[i].isbn) found = true;
      }
    } catch {
      console.log('forget it')
    }

    let heart = ``
    if (found) {
      heart = `<i class="fa fa-heart" aria-hidden="true"></i>`
    } else {
      heart = `<i class="fa fa-heart-o" aria-hidden="true"></i>`
    }

    resultElement.innerHTML = 
    '<img src="/static/img_avatar.png" alt="Avatar" style="width:100%">' +
    '<div class="container">' +
      '<h4><b>' + ts + '</b></h4>' + 
      '<p>' + aut + ', isbn: ' + isbn + '</p>';

    

    let b = document.createElement('button')
    b.id = 'bm'
    b.value = responseString
    b.innerHTML = heart
    resultElement.appendChild(b)
  

    resultElement.innerHTML += `</div>`;
    resultsContainer.appendChild(resultElement);
    const func = function() {
      console.log('bookmark button clicked')
      postBookmark('/bookmark', responseString)
    }

    setBm(func)
    console.log("Create results end");
  }

  function clearResults() {
    resultsContainer.innerHTML = '';
  }

  function setBm(func) {
    const bm = document.getElementById('bm')
    bm.onclick = func
  }

})
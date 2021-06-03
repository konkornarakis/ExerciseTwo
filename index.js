var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      eq: function (a, b) { return a===b; },
  }
});

var sql = require('mssql');

var sqlConfig = {
    user: 'exercisetwo',
    password: 'exercisetwo',
    server: `79.131.185.146`,  
    database: 'ExerciseTwo',
    trustServerCertificate: true,
};

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use("/static", express.static('./static/'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

let bookmarks = []

const port = process.env.PORT || "8000";

app.get('/', (req, res) => {
  res.render('home.handlebars', { bookmarks });
});

app.get('/book/:isbn', (req, res) => {
  //
  res.send({found: true})
})

// app.get('/bookmarks', (req, res) => {
//   console.log(bookmarks);
//   res.json({bookmarks: bookmarks})
// })

// app.post('/bookmark', function (req, res) {
//   //res.send('POST request: Bookmark, ' + req.body.isbn);
//   if (bookmarks.find(element => element.isbn === req.body.isbn)) {
//     console.log('isbn found, ' + req.body.isbn)
//   } else {
//     bookmarks.push({
//       isbn: req.body.isbn
//     })
//   }
//   res.redirect('/')
// })

app.get('/testsql', (req, res) => {
    (async function () {
        try {
            console.log("sql connecting...")
            let pool = await sql.connect(sqlConfig)
            let result = await pool.request()
                .query(`SELECT * FROM [ExerciseTwo].[dbo].[Bookmarks];`)
            console.log('sql results: ')
            console.log(result)
            res.redirect('/')
        } catch (err) {
            console.log(err);
            console.log('failed to connect to db')
            res.redirect('/')
        }
    })()
})




app.get('/bookmarks', (req, res) => {
  //console.log(bookmarks);
  res.json({bookmarks})
})

app.post('/bookmark', function (req, res) {
  console.log('post /bookmark')
  console.dir(req.body)
  if (bookmarks.find(element => element.isbn === req.body.isbn)) {
    console.log('removing from bookmarks: ' + req.body.isbn)
    var index = bookmarks.findIndex(function(o){
      return o.isbn === req.body.isbn;
    })
    if (index !== -1) bookmarks.splice(index, 1);
  } else {
    console.log('pushing to bookmarks: ' + req.body.isbn)
    bookmarks.push(req.body)
  }
  res.redirect('/')
})

app.get('/list', (req, res) => {
  console.log('/list')
  res.render('list.handlebars', { bookmarks: bookmarks })
})

// app.get('/edit', (req, res) => {
//   res.render('edit.handlebars')
// })

app.get('/edit/:isbn', (req, res) => {
  let isbn = req.params.isbn
  let book = bookmarks.find(element => element.isbn === isbn)
  console.log('requested to edit: ' + isbn)
  console.log(book)
  // res.redirect('/edit')
  res.render('edit.handlebars', {isbn: isbn, author: book.author, titleshort: book.titleshort, comments: book.comments})
})

app.post('/edit', (req, res) => {
  let isbn = req.body.isbn
  let book = bookmarks.find(element => element.isbn === isbn)
  let newTitlesshort = req.body.titleshort
  let newAuthor = req.body.author
  let newComments = req.body.comments

  console.log('requested edit: ')
  console.log('isbn: ' + isbn + ", titleshort: " + newTitlesshort + ", author: " + newAuthor + ", comments: " + newComments + ".")
  console.log('old values: ')
  console.log('isbn: ' + isbn + ", titleshort: " + book.titleshort + ", author: " + book.author + ", comments: " + book.comments + ".")

  book.titleshort = newTitlesshort
  book.author = newAuthor
  book.comments = newComments

  res.redirect('/list')
})

app.get('*', (req, res) => {
    res.send('404. Δεν βρέθηκε.')
})

/**
 * Server Activation
 */
 app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

bookmarks.push({
  "@uri": "test",
  "author": "author test",
  "authors": {
      "authorId": {
          "@contributortype": "A",
          "$": "2026404"
      }
  },
  "authorweb": "Penguin Merchandise",
  "awards": null,
  "characters": null,
  "contributorlast1": "Penguin Merchandise",
  "division": "Penguin Merchandise",
  "formatcode": "NT",
  "formatname": "Non-traditional book",
  "imprint": "Penguin Gear",
  "isbn": "1test",
  "isbn10": "012124437Z",
  "isbn10hyphenated": "012124437Z",
  "isbn13hyphenated": "506-0-12-124437-5",
  "keyword": "Poster Wrap: Montage :  : Penguin Merchandise : Penguin Gear : NON-CLASSIFIABLE :  :  : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5 : ",
  "onsaledate": "01/25/2013",
  "pages": "0",
  "pricecanada": "3.25",
  "priceusa": "2.45",
  "relatedisbns": {
      "isbn": [
          {
              "@formatcode": "NT",
              "$": "5060121244375"
          },
          {
              "@formatcode": "NT",
              "$": "5060121244368"
          }
      ]
  },
  "salestatus": "NR",
  "subformat": "ZA",
  "subjectcategory1": "NON000000",
  "subjectcategorydescription1": "NON-CLASSIFIABLE",
  "tgpdf": "false",
  "themes": null,
  "titleauthisbn": "Poster Wrap: Montage : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleshort": "MONTAGE - POSTER WRAP",
  "titlesubtitleauthisbn": "Poster Wrap: Montage :  : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleweb": "Poster Wrap: Montage",
  "updatedOn": "2020-11-06T06:20:09.000",
  "webdomains": {
      "webdomain": [
          {
              "@sell": "true",
              "@domain": "CA"
          },
          {
              "@sell": "true",
              "@domain": "COMPCOP"
          },
          {
              "@sell": "true",
              "@domain": "PGI.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.NA"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US_"
          },
          {
              "@sell": "true",
              "@domain": "SALESIN"
          },
          {
              "@sell": "true",
              "@domain": "SALESPL"
          }
      ]
  },
  "links": null,
  "workid": "286228"
})

bookmarks.push({
  "@uri": "test",
  "author": "author test",
  "authors": {
      "authorId": {
          "@contributortype": "A",
          "$": "2026404"
      }
  },
  "authorweb": "Penguin Merchandise",
  "awards": null,
  "characters": null,
  "contributorlast1": "Penguin Merchandise",
  "division": "Penguin Merchandise",
  "formatcode": "NT",
  "formatname": "Non-traditional book",
  "imprint": "Penguin Gear",
  "isbn": "2test",
  "isbn10": "012124437Z",
  "isbn10hyphenated": "012124437Z",
  "isbn13hyphenated": "506-0-12-124437-5",
  "keyword": "Poster Wrap: Montage :  : Penguin Merchandise : Penguin Gear : NON-CLASSIFIABLE :  :  : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5 : ",
  "onsaledate": "01/25/2013",
  "pages": "0",
  "pricecanada": "3.25",
  "priceusa": "2.45",
  "relatedisbns": {
      "isbn": [
          {
              "@formatcode": "NT",
              "$": "5060121244375"
          },
          {
              "@formatcode": "NT",
              "$": "5060121244368"
          }
      ]
  },
  "salestatus": "NR",
  "subformat": "ZA",
  "subjectcategory1": "NON000000",
  "subjectcategorydescription1": "NON-CLASSIFIABLE",
  "tgpdf": "false",
  "themes": null,
  "titleauthisbn": "Poster Wrap: Montage : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleshort": "MONTAGE - POSTER WRAP",
  "titlesubtitleauthisbn": "Poster Wrap: Montage :  : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleweb": "Poster Wrap: Montage",
  "updatedOn": "2020-11-06T06:20:09.000",
  "webdomains": {
      "webdomain": [
          {
              "@sell": "true",
              "@domain": "CA"
          },
          {
              "@sell": "true",
              "@domain": "COMPCOP"
          },
          {
              "@sell": "true",
              "@domain": "PGI.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.NA"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US_"
          },
          {
              "@sell": "true",
              "@domain": "SALESIN"
          },
          {
              "@sell": "true",
              "@domain": "SALESPL"
          }
      ]
  },
  "links": null,
  "workid": "286228"
})

bookmarks.push({
  "@uri": "test",
  "author": "author test",
  "authors": {
      "authorId": {
          "@contributortype": "A",
          "$": "2026404"
      }
  },
  "authorweb": "Penguin Merchandise",
  "awards": null,
  "characters": null,
  "contributorlast1": "Penguin Merchandise",
  "division": "Penguin Merchandise",
  "formatcode": "NT",
  "formatname": "Non-traditional book",
  "imprint": "Penguin Gear",
  "isbn": "3test",
  "isbn10": "012124437Z",
  "isbn10hyphenated": "012124437Z",
  "isbn13hyphenated": "506-0-12-124437-5",
  "keyword": "Poster Wrap: Montage :  : Penguin Merchandise : Penguin Gear : NON-CLASSIFIABLE :  :  : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5 : ",
  "onsaledate": "01/25/2013",
  "pages": "0",
  "pricecanada": "3.25",
  "priceusa": "2.45",
  "relatedisbns": {
      "isbn": [
          {
              "@formatcode": "NT",
              "$": "5060121244375"
          },
          {
              "@formatcode": "NT",
              "$": "5060121244368"
          }
      ]
  },
  "salestatus": "NR",
  "subformat": "ZA",
  "subjectcategory1": "NON000000",
  "subjectcategorydescription1": "NON-CLASSIFIABLE",
  "tgpdf": "false",
  "themes": null,
  "titleauthisbn": "Poster Wrap: Montage : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleshort": "MONTAGE - POSTER WRAP",
  "titlesubtitleauthisbn": "Poster Wrap: Montage :  : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleweb": "Poster Wrap: Montage",
  "updatedOn": "2020-11-06T06:20:09.000",
  "webdomains": {
      "webdomain": [
          {
              "@sell": "true",
              "@domain": "CA"
          },
          {
              "@sell": "true",
              "@domain": "COMPCOP"
          },
          {
              "@sell": "true",
              "@domain": "PGI.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.NA"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US_"
          },
          {
              "@sell": "true",
              "@domain": "SALESIN"
          },
          {
              "@sell": "true",
              "@domain": "SALESPL"
          }
      ]
  },
  "links": null,
  "workid": "286228"
})

bookmarks.push({
  "@uri": "test",
  "author": "author test",
  "authors": {
      "authorId": {
          "@contributortype": "A",
          "$": "2026404"
      }
  },
  "authorweb": "Penguin Merchandise",
  "awards": null,
  "characters": null,
  "contributorlast1": "Penguin Merchandise",
  "division": "Penguin Merchandise",
  "formatcode": "NT",
  "formatname": "Non-traditional book",
  "imprint": "Penguin Gear",
  "isbn": "4test",
  "isbn10": "012124437Z",
  "isbn10hyphenated": "012124437Z",
  "isbn13hyphenated": "506-0-12-124437-5",
  "keyword": "Poster Wrap: Montage :  : Penguin Merchandise : Penguin Gear : NON-CLASSIFIABLE :  :  : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5 : ",
  "onsaledate": "01/25/2013",
  "pages": "0",
  "pricecanada": "3.25",
  "priceusa": "2.45",
  "relatedisbns": {
      "isbn": [
          {
              "@formatcode": "NT",
              "$": "5060121244375"
          },
          {
              "@formatcode": "NT",
              "$": "5060121244368"
          }
      ]
  },
  "salestatus": "NR",
  "subformat": "ZA",
  "subjectcategory1": "NON000000",
  "subjectcategorydescription1": "NON-CLASSIFIABLE",
  "tgpdf": "false",
  "themes": null,
  "titleauthisbn": "Poster Wrap: Montage : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleshort": "MONTAGE - POSTER WRAP",
  "titlesubtitleauthisbn": "Poster Wrap: Montage :  : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleweb": "Poster Wrap: Montage",
  "updatedOn": "2020-11-06T06:20:09.000",
  "webdomains": {
      "webdomain": [
          {
              "@sell": "true",
              "@domain": "CA"
          },
          {
              "@sell": "true",
              "@domain": "COMPCOP"
          },
          {
              "@sell": "true",
              "@domain": "PGI.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.NA"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US_"
          },
          {
              "@sell": "true",
              "@domain": "SALESIN"
          },
          {
              "@sell": "true",
              "@domain": "SALESPL"
          }
      ]
  },
  "links": null,
  "workid": "286228"
})

bookmarks.push({
  "@uri": "test",
  "author": "author test",
  "authors": {
      "authorId": {
          "@contributortype": "A",
          "$": "2026404"
      }
  },
  "authorweb": "Penguin Merchandise",
  "awards": null,
  "characters": null,
  "contributorlast1": "Penguin Merchandise",
  "division": "Penguin Merchandise",
  "formatcode": "NT",
  "formatname": "Non-traditional book",
  "imprint": "Penguin Gear",
  "isbn": "5test",
  "isbn10": "012124437Z",
  "isbn10hyphenated": "012124437Z",
  "isbn13hyphenated": "506-0-12-124437-5",
  "keyword": "Poster Wrap: Montage :  : Penguin Merchandise : Penguin Gear : NON-CLASSIFIABLE :  :  : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5 : ",
  "onsaledate": "01/25/2013",
  "pages": "0",
  "pricecanada": "3.25",
  "priceusa": "2.45",
  "relatedisbns": {
      "isbn": [
          {
              "@formatcode": "NT",
              "$": "5060121244375"
          },
          {
              "@formatcode": "NT",
              "$": "5060121244368"
          }
      ]
  },
  "salestatus": "NR",
  "subformat": "ZA",
  "subjectcategory1": "NON000000",
  "subjectcategorydescription1": "NON-CLASSIFIABLE",
  "tgpdf": "false",
  "themes": null,
  "titleauthisbn": "Poster Wrap: Montage : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleshort": "MONTAGE - POSTER WRAP",
  "titlesubtitleauthisbn": "Poster Wrap: Montage :  : Penguin Merchandise : 012124437Z : 012124437Z : 5060121244375 : 506-0-12-124437-5",
  "titleweb": "Poster Wrap: Montage",
  "updatedOn": "2020-11-06T06:20:09.000",
  "webdomains": {
      "webdomain": [
          {
              "@sell": "true",
              "@domain": "CA"
          },
          {
              "@sell": "true",
              "@domain": "COMPCOP"
          },
          {
              "@sell": "true",
              "@domain": "PGI.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.NA"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US"
          },
          {
              "@sell": "true",
              "@domain": "PRH.US_"
          },
          {
              "@sell": "true",
              "@domain": "SALESIN"
          },
          {
              "@sell": "true",
              "@domain": "SALESPL"
          }
      ]
  },
  "links": null,
  "workid": "286228"
})
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
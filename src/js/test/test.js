const fn1 = (callback) => {
  const curry = p => {
    // blahblah
    callback(p);
    // blahblah
  }
  // do something
  // callback
  ajax.request(url, result => {
    callback(intend);
  });
}


fn1(callback)
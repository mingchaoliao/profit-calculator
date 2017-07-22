var token = chrome.storage.local.get(null, function(items) {
    if(items.token) {
        console.log(items.token);
    } else {
        console.log("no token");
    }
});

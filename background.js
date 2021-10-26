
var imageList = [];

const filter = {
  url: [
    {
      urlMatches: 'https://www.instagram.com/',
    },
  ],
};

chrome.webNavigation.onCompleted.addListener(() => {
  console.log("The user has loaded my favourite site.");

  chrome.webRequest.onCompleted.addListener(function(details){

    if (details.url.includes('p640x640') || details.url.includes('s640x640')) {

      chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {

        // Since the title looks like below:
        // k a t e [emoji] (@helloiamkate) * Instagram photos and videos
        // we want to grab everything between the parentheses

        var tempTab = (String(tab[0].title)).match(/\((.*)\)/).pop();

        var tempJSON = { title: tempTab, url: details.url, request: details.requestId };

        imageList.push(tempJSON);

        chrome.storage.local.set({'imageList': imageList}, function() {
          console.log('Saved Image List to Local Storage');
        });
      });

    }
  },
  {urls: ["<all_urls>" ],types:["image","media"]});

}, filter);


chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, {oldValue, newValue }] of Object.entries(changes)) {

    // I want to purely have this check to empty the array if the user uses the content page to clear data

    if (String(key) == 'imageList' && String(namespace) == 'local' && String(newValue) == 'undefined') {
      console.log('User requested storage to be cleared from Content Page or Otherwise the stored data has been removed. This should clear the local array.');
      imageList = [];
    }

  }
});

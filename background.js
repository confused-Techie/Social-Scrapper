
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

    if (details.url.includes('p640x640') || details.url.includes('s640x640') || details.url.includes('p1080x1080') || details.url.includes('s1080x1080') || (details.url.includes('/e35/') && !(details.url.includes('s150x150') || details.url.includes('s320x320')))  ) {

      console.info(`Matching URL to add: ${details.url}`);

      // Set the badge color to blue to indicate its starting to save
      chrome.action.setBadgeBackgroundColor({color: "#0000ff"});

      chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {

        // Since the title looks like below:
        // k a t e [emoji] (@helloiamkate) * Instagram photos and videos
        // we want to grab everything between the parentheses

        // Since in some instances this can fail, this will default to user.
        var tempTab = 'user';

        try {
          tempTab = (String(tab[0].title)).match(/\((.*)\)/).pop();
        } catch(err) {
          console.log(`Error Occured Setting Tab: ${err}`);
          console.log('Defaulting Tab to user');
        }


        var tempJSON = { title: tempTab, url: details.url, request: details.requestId };


        if (!imageList.includes(details.url)) {
          imageList.push(details.url);

          chrome.storage.local.set({'imageList': imageList}, function() {
            console.log('Saved Image List to Local Storage');

            chrome.storage.local.set({'user': tempTab}, function() {
              console.log('Saved Current Instagram User to Local Storage');
            });

            chrome.action.setBadgeText({text: `${imageList.length}`});
          });
        } else {
          console.error(`This URL has already been saved: ${details.url}`);
        }
        //imageList.push(tempJSON);

        //chrome.storage.local.set({'imageList': imageList}, function() {
        //  console.log('Saved Image List to Local Storage');

        //  chrome.action.setBadgeText({text: `${imageList.length}`});

        //});
      });

    } else {
      // the web request did not match the ifs
      console.info(`Ignored the following link: ${details.url}`);
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


document.addEventListener('DOMContentLoaded', function() {

  chrome.storage.local.get(['imageList'], function(res) {
    var tempHtml = '';

    try {
      res.imageList.forEach((element, index) => {
        // While this works the image doesn't display because of instagrams CORS policy.
        // Returning: net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin
        // Will instead use the User Name of the user.
        var tempUser = 'user';
        chrome.storage.local.get(['user'], function(result) {
          tempUser = result;
        });
        tempHtml += "<ul class='main-list'>";
        tempHtml += `<li><a href='${element}' target='_blank'><p>${tempUser}</p></a></li>`;
        tempHtml += "</ul>";
      });
    } catch(err) {
      // this will be a simple catch, for if no data exists yet, to not cause any errors.
      console.log(`Getting the Image List failed, likely this means that it is empty, or is null after clearing the data.`);
      console.log(`The following is the saved data in case this is not the issue: ${res}: ${err}`);
    }
    document.getElementById("contentFill").innerHTML = tempHtml;

  });


  var clearDataBtn = document.getElementById("clearDataBtn");

  clearDataBtn.addEventListener('click', function() {
    chrome.storage.local.clear();
    chrome.action.setBadgeText({text: ''});
  });

  var openAllBtn = document.getElementById("openAllBtn");

  openAllBtn.addEventListener('click', function() {
    chrome.storage.local.get(['imageList'], function(res) {
      try {
        res.imageList.forEach((element, index) => {
          // this will append the requestID as the target of the new tab, to help ensure each is opened as a new tab. Instead of applying to one.
          // https://stackoverflow.com/a/24435877/12707685
          console.log(`Opening: ${index}: ${element}`);
          //window.open(`${element.url}`, `${element.request}`);
          // Since this is failing to open all windows, and my concern is that some of the requestIDs could be the same,
          // I will try using native chrome apis instead
          chrome.tabs.create({
            url: element
          });
        });
      } catch(err) {
        console.error(err);
      }
    });
  });
});

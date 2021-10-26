
document.addEventListener('DOMContentLoaded', function() {

  chrome.storage.local.get(['imageList'], function(res) {
    var tempHtml = '';
    console.log(res);
    res.imageList.forEach((element, index) => {
      // While this works the image doesn't display because of instagrams CORS policy.
      // Returning: net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin
      // Will instead use the User Name of the user.
      tempHtml += "<ul class='main-list'>";
      tempHtml += `<li><a href='${element.url}' target='_blank'><p>${element.title}</p></a></li>`;
      tempHtml += "</ul>";
    });
    document.getElementById("contentFill").innerHTML = tempHtml;

  });


  var clearDataBtn = document.getElementById("clearDataBtn");

  clearDataBtn.addEventListener('click', function() {
    chrome.storage.local.clear();
  });
});

tinymce.init({
  selector: '.editor',
  setup: function (editor) {
    editor.on('init', function () {
      // Add input event listener to the editor's content area
      var editorContentArea = editor.getDoc().body;
      editorContentArea.addEventListener('input', handleEditorInput);
    });
  },
});


try {
// Handle input event
function handleEditorInput(event) {
  var target = event.target;
  var content = target.innerHTML;

  // Check if the content contains YouTube links
  if (isYouTubeLink(content)) {
    // Create a temporary container to parse the content
    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;

    // Get all <p> elements inside the container
    var paragraphElements = tempContainer.getElementsByTagName('p');

    // Loop through each <p> element
    for (var i = 0; i < paragraphElements.length; i++) {
      var paragraph = paragraphElements[i];
      var paragraphText = paragraph.innerText;

      // Check if the paragraph contains a YouTube link
      if (isYouTubeLink(paragraphText)) {
        var youtubeUrl = extractYouTubeUrl(paragraphText);
        var videoId = extractYouTubeVideoId(youtubeUrl);

        // Create an iframe to preview the video
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId;
        iframe.width = '560';
        iframe.height = '315';

        // Append the iframe to the paragraph element
        paragraph.appendChild(iframe);

        // Generate a text with the title
        generateTitleText(youtubeUrl, function (title) {
          var titleText = document.createTextNode('Title: ' + title);

          // Append the title text to the paragraph element
          paragraph.appendChild(titleText);
        });
      }
    }

    // Update the content with the modified HTML
    target.innerHTML = tempContainer.innerHTML;
  }
}

// Function to check if a given text is a YouTube link
function isYouTubeLink(text) {
  var youtubeRegex = /(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}/;
  return youtubeRegex.test(text);
}

// Function to extract the YouTube URL from a given text
function extractYouTubeUrl(text) {
  var youtubeRegex = /(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}/;
  var match = text.match(youtubeRegex);
  return match[0];
}

// Function to extract the YouTube video ID from a given URL
function extractYouTubeVideoId(url) {
  var videoIdRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/;
  var match = url.match(videoIdRegex);
  return match[1];
}

// Function to generate the title for a YouTube video
function generateTitleText(url, callback) {
  getTitleFromYouTubeAPI(url, function (title) {
    callback(title);
  });
}

// Function to retrieve the title from the YouTube Data API
function getTitleFromYouTubeAPI(url, callback) {
  // Make an API request to fetch the video title asynchronously
  // Replace 'YOUR_API_KEY' with your actual YouTube Data API key
  var apiKey = 'AIzaSyDsB4WozzaRvSNYwa1WrcPHvx1Mc4AtVMg';
  var videoId = extractYouTubeVideoId(url);
  var apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

  // Make the API request
  var xhr = new XMLHttpRequest();
  xhr.open('GET', apiUrl, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var title = response.items[0].snippet.title;
      callback(title);
    }
  };
  xhr.send();
}} catch (error) {
  console.log(error);
}

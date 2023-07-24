tinymce.init({
    selector: '.editor',
    setup: function (editor) {
      editor.on('change', function () {
       // var content = editor.getContent();
      //  const pastedText = content.getData('text/plain');
  
       // const youtubeLinks = extractYouTubeLinks(pastedText);
    var youtubeLinks = document.querySelector("#tinymce > p");
        youtubeLinks.forEach(function (link) {
          const videoId = getYouTubeVideoId(link);
          showPreview(videoId);
        });
      });
    }
  });

  function extractYouTubeLinks(content) {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/|v\/|\.+\/|\.+be\/)([^\s&?#<>]+)/gi;
    return content.match(youtubeRegex) || [];
  }

  function isYouTubeLink(text) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(text);
  }

  function getYouTubeVideoId(url) {
    const match = url.match(/[?&]v=([^&#]+)/);
    return match ? match[1] : null;
  }

  function showPreview(videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = `<iframe width="100%" height="100%" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
  }

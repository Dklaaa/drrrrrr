tinymce.init({
    selector: 'textarea#default',
    //width: 700,
   // height: 300,
    plugins:[
        'advlist', 'autolink', 'link', 'image','editimage', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 
        'table', 'emoticons', 'template', 'codesample', 'autoresize'
    ],
    toolbar: 'undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |' + 
    'bullist numlist outdent indent | link image | print preview  fullscreen | ' +
    'forecolor backcolor emoticons',
    menu: {
        favs: {title: 'Menu', items: 'code visualaid | searchreplace | emoticons'}
    },
    menubar: 'favs file edit view insert format tools table',
    //content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:16px}',
    

    ////////////////////////////////// Object Resizing ////////////////////////////////////////////////////////////////////

  object_resizing: 'img',
  // vetem img mund te bejn resize
  object_resizing_captions: "force",
  
  init_instance_callback: (editor) => {
    editor.on('ExecCommand', (e) => {
      console.log(`The ${e.command} command was fired.`);
    });
  },

  // fixed size per iframe
  paste_postprocess: (editor, { node }) => {
    if (node.nodeName === 'IFRAME') {
      node.setAttribute('width', '300');
      node.setAttribute('height', '200');
    }
  },

  paste_postprocess: (editor, { node }) => {
    if (node.nodeName === 'IMG') {
      node.setAttribute('width', '300');
      node.setAttribute('height', '200');
    }
  }, 

  paste_preprocess: function (plugin, args) {
    var images = args.content.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) {
      images[i].setAttribute('width', '300');
      images[i].setAttribute('height', '200');
    }
  },

  //kur tentohet qe img te behet resize do te marri direkt max dhe min sizes
  setup: function(editor) {
    editor.on('ObjectResizeStart', function(e) {
      if (e.target.nodeName === 'IMG') {
         e.target.style.maxWidth = '300px';
         e.target.style.maxHeight = '300px';
         e.target.style.minHeight = '150px';
         e.target.style.minWidth = '150px';
      }
    });
  },


  ///////////////////////////////////////   LINK PREVIEW    ///////////////////////////////////////////////////////////////////////////
paste_preprocess: (editor, args) => {
      console.log(args.content);
          var youtubeLinks = extractYouTubeLinks(args.content);
          youtubeLinks.forEach((link) => {
              const videoId = getYouTubeVideoId(link);
              const embedUrl = `https://www.youtube.com/embed/${videoId}`;
              const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen style="width: 300px; height: 200px;"></iframe>`;
              args.content = args.content.replace(link, iframe);
              const imageRegex = /<img[^>]+src="([^">]+)"/g;
              args.content = args.content.replace(imageRegex, '<img src="$1" style="width: 300px; height: 200px;" />');
          });
      },
 content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:16px; max-width:100%; height:auto;}',
     
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
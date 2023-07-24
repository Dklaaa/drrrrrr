const CopyToClipboard = (containerid) => {

    let range = document.createRange();

    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    
    alert("Username copied to clipboard.")

}
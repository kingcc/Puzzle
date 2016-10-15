//http://cdn.bootcss.com/jquery/3.1.1/jquery.js
$(function() {
  $('body').mousedown(function(e1) {
    $('body').one('mouseup', function(e2) {
      if (window.getSelection) {

        var startNode = $(e1.target);
        var endNode = $(e2.target);
        if (startNode[0] === endNode[0]) {

          var selection = window.getSelection();
          var textObj = $(selection.getRangeAt(0).commonAncestorContainer.parentElement);
          var selected = selection.toString();
          var selectedText = '<span id="puzzle">' + selected + '</span>';

          var start = selection.anchorOffset;
          var end = selection.focusOffset;
          if (start > end) start = [end, end = start][0];

          var tempStr1 = startNode.html().substring(0, start);
          var tempStr2 = endNode.html().substring(end);
          textObj.html(tempStr1 + selectedText + tempStr2);

          $('body').one('mousedown', function() {
            textObj.html(tempStr1 + selected + tempStr2);
          });
        } else {
          window.getSelection().removeAllRanges();
        }
      }
    });
  });
});

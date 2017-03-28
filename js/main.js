window.onload = function() {
  var port;
  var fox = false;
  chrome.tabs.query({ active: true, currentWindow: true },
    function(tabs) {
      port = chrome.tabs.connect(
        tabs[0].id, { name: "con1" }
      );
      setTimeout(function() {
        port.postMessage({ cmd: 'check' });
      }, 0);

      port.onMessage.addListener(function({ cmd }) {
        if (cmd === 'check-true') {
          fox = true;
          document.getElementById('toggle').checked = fox;
        }
      });
    });


  document.getElementById('toggle').checked = fox;

  document.getElementById('toggle').addEventListener('click', function() {
    port.postMessage({ cmd: 'click' });
  });
};

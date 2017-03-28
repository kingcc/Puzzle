var
  js = document.createElement('script'),
  css = document.createElement('style'),
  run = document.createElement('i'),
  head = document.getElementsByTagName('head')[0],
  body = document.getElementsByTagName('body')[0];


var jsCode = `var selection;
var focusNode;
var focusNodeText;
var next;
var parent;
var puzzleWord;
var puzzleResult;
var words;
var wordArray;
var currentWord;
var flag = false;

function puzzleInit() {
  if (flag === false) return;

  if (focusNodeText !== document.getSelection().focusNode.nodeValue && words !== undefined) {
    for (var i = 0; i < words.length; i++) {
      if (words[i].className === 'word result') {
        words[i].innerHTML = '';
      }
      words[i].innerHTML = words[i].innerText;
      words[i].className = '';
      words[i].style.display = 'inline';
    }
  }
  puzzle();
}

function show(data) {
  if (data.errorCode === 0) {
    puzzleResult.innerText = data.translation[0];
  }
  parent.insertBefore(puzzleResult, next);
  parent.insertBefore(puzzleWord, puzzleResult);
  words = document.querySelectorAll('.word');
  wordArray = [];
  currentWord = 0;
  words[currentWord].style.display = 'inline';
  for (var i = 0; i < words.length; i++) {
    splitLetters(words[i]);
  }
}

function getResult(req) {
  if (!req) return;
  var
    js = document.createElement('script'),
    head = document.getElementsByTagName('head')[0];
  js.src = 'https://fanyi.youdao.com/openapi.do?keyfrom=Puzzle&key=1892828066&type=data&doctype=jsonp&callback=show&version=1.1&q=' + req;
  head.appendChild(js);
}

function changeWord(e) {
  if (e.keyCode !== 17) return;
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length - 1 ? wordArray[0] : wordArray[currentWord + 1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }

  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.display = 'inline';
    animateLetterIn(nw, i);
  }
  if (currentWord === 0) {
    puzzleWord.style.display = 'none';
  } else {
    puzzleResult.style.display = 'none';
  }
  currentWord = (currentWord == wordArray.length - 1) ? 0 : currentWord + 1;
}

function animateLetterOut(cw, i) {
  setTimeout(function() {
    cw[i].className = 'letter out';
  }, i * 80);
}

function animateLetterIn(nw, i) {
  setTimeout(function() {
    nw[i].className = 'letter in';
  }, 340 + (i * 80));
}

function splitLetters(word) {
  var content = word.innerText;
  word.innerHTML = '';
  var letters = [];
  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerHTML = content.charAt(i);
    word.appendChild(letter);
    letters.push(letter);
  }
  wordArray.push(letters);
}

function puzzle(e) {
  if (flag === false) return;
  selection = document.getSelection();
  focusNode = selection.focusNode;
  focusNodeText = selection.focusNode.nodeValue;
  next = selection.focusNode.nextSibling;
  parent = focusNode.parentElement;
  puzzleWord = document.createElement('span');
  puzzleResult = document.createElement('span');

  if (focusNode.nodeType !== 3) {
    return;
  }
  focusNode.parentNode.removeChild(focusNode);
  puzzleWord.setAttribute('class', 'word');
  puzzleWord.innerHTML = focusNodeText;
  puzzleResult.setAttribute('class', 'word result');
  getResult(puzzleWord.innerHTML);

}

function main(){
	if (flag === false) {
		document.removeEventListener("mouseup", puzzleInit);
		document.removeEventListener("mouseup", function() {});
	    document.removeEventListener("keydown", changeWord);
	}else{
		document.addEventListener("mouseup", puzzleInit);
		document.addEventListener("mouseup", function() {});
	    document.addEventListener("keydown", changeWord);
	}
}

function toggle(){
	flag = !flag;
	main();
}

`

var cssCode = `
::selection,
::-moz-selection {
    color: red;
}

.word {
    display: none;
}

.word:after {
    clear: both;
}

.letter {
    display: inline-block;
    position: relative;
    min-width: .2em;
    transform: translateZ(25px);
    transform-origin: 50% 50% 25px;
}

.letter.out {
    transform: rotateX(90deg);
    transition: transform 0.16s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.letter.behind {
    transform: rotateX(-90deg);
}

.letter.in {
    transform: rotateX(0deg);
    transition: transform 0.19s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

`


window.onload = function() {
  var fox = false;
  js.innerHTML = jsCode;
  css.innerHTML = cssCode;
  run.style.display = 'none';
  run.setAttribute('onclick', 'toggle()');
  head.appendChild(js);
  head.appendChild(css);
  body.appendChild(run);
  chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === 'con1') {
      port.onMessage.addListener(function({ cmd }) {
        if (cmd === 'click') {
          fox = !fox;
          run.click();
        } else if (cmd === 'check' && fox) {
          port.postMessage({ cmd: 'check-true' });
        }
      });
    }
  });
};

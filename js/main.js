/**
 * A Dom node, like the one you get from getElementById or other query selectors
 * @typedef {Object} DOMNode
 */

const TT = {
  NUM199:   "Numbers 1-99",
  MOS_DAYS: "Months & Days",
  LG_NUMS: "Large Numbers",
  CP_TO_CLIP: "Copy to Clipboard",
  DBKEY: "RTCPT",
  COPIED_TEXT: "Copied!",
  NOTHING_TO_COPY: "Nothing to copy!",
  CURRENT_SET_EMPTY: "Current Set is Empty!",
  DELETEALL_MESSAGE: "You just clicked Delete All.\nAre you certain you want to do this?",
  STORAGE_SECURITY: "Current security settings prevent loading and saving practice sets.\nPleaes check your browser settings.",
  CLEARED: "Cleared!",
  COPY_PROMISE_FAILED: "Copy to clipboard failed!"
};

const AR_MO_DAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

var DB = [];

const OPTIONS =
  '<option>' +
    '{{set}}' +
  '</option>';

/****************************************************************************************
*
* Init Section
*
****************************************************************************************/
window.addEventListener("load", function() {
  let myStore = window.localStorage,
      dbStr;

  if (!myStore) {
    alert(TT.STORAGE_SECURITY);
    return;
  }

  dbStr = myStore.getItem(TT.DBKEY);

  if (!dbStr) {
    return;
  } else {
    DB = JSON.parse(dbStr);
  }

  loadSetList(DB);
  return;
});

/****************************************************************************************
*
* 3x5x3 Shuffle Section
*
****************************************************************************************/

$("btnByShuffle").addEventListener("click", function() {
  let csv = $("currentSet").value,
      ar = csv.split("\n"),
      outArray = [],
      breakLines = $("inByBreak").value,
      result = "";

  for (let i = ar.length, j = 0; i < 5; i++, j++) {
    ar.push(ar[j]);
  }
  
  for (let i = 0; i < ar.length-4; i++) {
    for (let j = 0; j < 3; j++) {
      outArray.push(ar[i]);
      outArray.push(ar[i+1]);
      outArray.push(ar[i+2]);
      outArray.push(ar[i+3]);
      outArray.push(ar[i+4]);
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < ar.length; j++) {
      outArray.push(ar[j]);
    }
  }

  result = getResult(outArray,breakLines);
  $("byResult").value = result;
});

$("btnByClip").addEventListener("click", function() {
  let v = $("byResult").value;

  if (v === '') {
    toastInnerText("btnByClip", TT.NOTHING_TO_COPY);
    return;
  }

  writeToClipboard(v, function() {
    toastInnerText("btnByClip", TT.COPIED_TEXT);
  });
});

/****************************************************************************************
*
* Alternating Shuffle Section
*
****************************************************************************************/

$("btnAltShuffle").addEventListener("click", function() {
  let csv = $("currentSet").value,
      ar = csv.split("\n"),
      outArray = [],
      breakLines = $("inAltBreak").value,
      result = "";

  for (let i = 0; i < ar.length; i++) {
    outArray.push(ar[i]);

    for (let j = 0; j < ar.length; j++) {
      if (ar[i] == ar[j]) {
        continue;
      }
      outArray.push(ar[j]);
      outArray.push(ar[i]);
    }
  }

  result = getResult(outArray,breakLines);
  $("altResult").value = result;
});

$("btnAltClip").addEventListener("click", function() {
  let v = $("altResult").value;

  if (v === '') {
    toastInnerText("btnAltClip", TT.NOTHING_TO_COPY);
    return;
  }

  writeToClipboard(v, function() {
    toastInnerText("btnAltClip", TT.COPIED_TEXT);
  });
});

/****************************************************************************************
*
* Presets Section
*
****************************************************************************************/
$("btnPreNumbers").addEventListener("click", function() {
  let ar = getNumbers1t99(),
      breakLines = $("inPreBreak").value,
      numSets = $("inPreNum").value,
      result;

  ar = multiplySets(ar,numSets);
  ar = shuffle(ar);
  result = getResult(ar,breakLines);

  $("presetResult").value = result;

});

$("btnPreMonthsDays").addEventListener("click", function() {
  let ar = AR_MO_DAY,
      breakLines = $("inPreBreak").value,
      numSets = $("inPreNum").value,
      result;

  ar = multiplySets(ar,numSets);
  ar = shuffle(ar);
  result = getResult(ar,breakLines);

  $("presetResult").value = result;
});

$("btnPreLgNumbers").addEventListener("click", function() {
  let ar = [],
      numSets = $("inPreNum").value,
      breakLines = $("inPreBreak").value,
      result;

      Number.prototype.toLocaleString
  for (let i = 0; i < numSets; ++i) {
    ar[i] = getRandomIntInclusive(1,999999999).toLocaleString();
  }

  result = getResult(ar,breakLines);
  $("presetResult").value = result;
});

$("btnPreClip").addEventListener("click", function() {
  let v = $("presetResult").value;

  if (v === '') {
    toastInnerText("btnPreClip", TT.NOTHING_TO_COPY);
    return;
  }

  writeToClipboard(v, function() {
    toastInnerText("btnPreClip", TT.COPIED_TEXT);
  });
});

/****************************************************************************************
*
* Shuffle Section
*
****************************************************************************************/

$("btnShfShuffle").addEventListener("click", function() {
  let csv = $("currentSet").value,
      breakLines = $("inShfBreak").value,
      numSets = $("inShfNum").value,
      ar = [],
      result = "";

  if (csv === '') {
    toastInnerText("btnShfShuffle", TT.CURRENT_SET_EMPTY);
    return;
  }

  ar = csv.split("\n");
  ar = sanitizeSet(ar);
  ar = multiplySets(ar,numSets);

  ar = shuffle(ar);
  result = getResult(ar,breakLines);

  $("shuffleResult").value = result;
});

$("btnShfClip").addEventListener("click", function() {
  let v = $("shuffleResult").value;

  if (v === '') {
    toastInnerText("btnShfClip", TT.NOTHING_TO_COPY);
    return;
  }

  writeToClipboard(v, function() {
    toastInnerText("btnShfClip", TT.COPIED_TEXT);
  });
});

/****************************************************************************************
*
* Set Manager Section
*
****************************************************************************************/

$("setList").addEventListener("change", function(e) {
  let i = e.currentTarget.selectedIndex,
      ss = $('currentSet');

  if (i === -1) {
    return;
  }

  ss.value = DB[i].set.join("\n");
});

$("setList").addEventListener("click", function(e) {
  let i = e.currentTarget.selectedIndex,
      ss = $('currentSet');

  if (i === -1) {
    return;
  }

  ss.value = DB[i].set.join("\n");
});

$("btnSMClear").addEventListener("click", function() {
  $("currentSet").value = "";
  toastInnerText("btnSMClear", TT.CLEARED);
});

$("btnSMCreate").addEventListener("click", function() {
  let ssv = $("currentSet").value,
      t = {};

  if (ssv === '') {
    return;
  }

  t.set = ssv.split("\n");

  DB.push(t);
  saveToStorage(DB);
  loadSetList(DB);
});

$("btnSMUpdate").addEventListener("click", function() {
  let ssr = $("currentSet").value.split("\n")
      t = {},
      sl = $("setList"),
      index = sl.selectedIndex;

  if (index === -1) {
    return;
  }

  t.set = ssr;

  updateDBSet(index, t);
  saveToStorage(DB);
  loadSetList(DB);
});

$("btnSMDelete").addEventListener("click", function() {
  let sl = $("setList"),
      index = sl.selectedIndex;

  if (index === -1) {
    return;
  }

  deleteDB(index);
  saveToStorage(DB);
  loadSetList(DB);
});

$("btnSMClip").addEventListener("click", function() {
  let v = $("currentSet").value;

  if (v === '') {
    toastInnerText("btnSMClip", TT.NOTHING_TO_COPY);
    return;
  }

  writeToClipboard(v, function() {
    toastInnerText("btnSMClip", TT.COPIED_TEXT);
  });
});

/****************************************************************************************
*
* Functions
*
****************************************************************************************/

/**
 * Writes to clipboard, then executes callback
 * @param {string} theText What to write to clipboard
 * @param {Function} callback A function to execute on success
 */
function writeToClipboard(theText, callback) {
  navigator.clipboard.writeText(theText).then(function() {
    callback();
  }, function() {
    alert(TT.COPY_PROMISE_FAILED);
  });
}

/**
 * Removes newlines and leading/trailing spaces from user input
 * @param {Array} list User list, usually something from "Line1\nLine2".split("\n")
 * @returns {Array}
 */
function sanitizeSet(list) {
  list = list.map ( e => e.trim() ); //trims leading/trailing spaces
  list = list.filter ( e =>	e.length > 0); //deletes empty lines

  return list;
}

/**
 * Transforms an array into a string for a textarea, adding newline breaks
 * @param {Array} array An array ready for processing
 * @param {Number} numBeforeBreak When to insert a newline
 * @returns {string} A string formated for a textarea
 */
function getResult(array, numBeforeBreak) {
  let out = "",
      i = 1,
      lArray = ["",...array]; //for loop at index 1

  numBeforeBreak = parseInt(numBeforeBreak);
  for (i = 1; i < lArray.length-1; ++i) {
    out += lArray[i]+"\n";

    if (i >= numBeforeBreak && i % numBeforeBreak === 0) {
      out += "\n";
    }
  }

  out += lArray[i]
  return out;
}

// 
/**
 * Fisher–Yates shuffle, courtesy of Wikipedia? Quroa? SuperUser? Can't remember...
 * @param {Array} array An array of any
 * @returns {Array} a shuffled array
 */
function shuffle(array) {
  let currentIndex = array.length,
      randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


/**
 * Saves DB to localstorage, returns true if successful, false if not
 * @returns 
 */
function saveToStorage() {
  let myStore = window.localStorage,
      dbStr = JSON.stringify(DB);;

  if (!myStore) {
    return false;
  }

  myStore.setItem(TT.DBKEY, dbStr);
  return true;
}

/**
 *
 */
function loadSetList() {
  let sl = $("setList"),
      str = "";

  for (let i = 0; i < DB.length; ++i) {
    str += renderTemplate(OPTIONS, DB[i]);
  }

  sl.innerHTML = str;
}

/**
 * Modifies global DB and replaces item at index with newSet
 * @param {number} index
 * @param {Array<string>} newSet Array of strings representing an updated list of words/briefs/phrases/etc
 */
function updateDBSet(index, newSet) {
  DB[index] = newSet;
}

/**
 * Modifies global DB and removes item located at index
 * @param {number} index
 */
function deleteDB(index) {
  DB.splice(index,1);
}

/**
 * Temporarily replace node's innerText for visual feedback, usually a button
 * @param {(string | DOMNode)} element Dom node or ID string representing a node
 * @param {string} newText Text to use for the node
 */
function toastInnerText(element, newText) {
  let origText = "";

  switch (typeof element) {
    case 'string':
      element = $(element);
      break;
  }

  origText = element.innerText;
  element.innerText = newText;

  setTimeout(() => {
      element.innerText = origText;
  }, 1000);
}

/**
 * Return's true when readyState is complete
 * @returns {boolean} readyState is complete
 */
function isReady() {
  return (document.readyState === 'complete');
}

/**
 * Shorthand for getElementById
 * @param {string} element ID string
 * @returns {DOMNode} The node or null
 */
function $(element) {
    return document.getElementById(element);
}

/**
 * Returns a pseudo-random integer between two numbers, inclusive.
 * Credit to MDN.
 * @param {number} min Floor
 * @param {number} max Ceiling
 * @returns {number}
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  //The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * General use, simple templating function
 * @param {string} template an HTML string with {{subs}}, no spaces between curly braces e.g. "Hello {{world}}!"
 * @param {Object<string, string>} subObject an object containing subs to be used for rendering e.g. {world: "Earth"};
 * @returns {string} A processed template
 */
function renderTemplate(template, subObject) {
  const reg = /{{.*?}}/g;
  let subs = template.match(reg),
      item;

  for (let i = 0; i < subs.length; ++i) {
    item = new RegExp(subs[i], "g");
    template = template.replace(item, subObject[subs[i].slice(2,-2)]);
  }

  return template;
}

/**
 * Duplicates an input array
 * @param {Array<string>} ar Original array
 * @param {number} numSets number of duplications
 * @returns {Array<string>} new Array with duplicated sets based on input array
 */
function multiplySets(ar, numSets) {
  let newAR = [];

  for (let i = 0; i < numSets; ++i) {
    newAR = newAR.concat([...ar]);
  }

  return newAR;
}

/**
 * 
 * @returns {Array<number>} array of numbers 1-99
 */
function getNumbers1t99() {
  let ar = [0];
  for (let i = 1; i < 100; ++i) {
    ar[i]=i;
  }
  return ar;
}
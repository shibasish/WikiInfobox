document.getElementById('fileInput').addEventListener('change', readFile, false);
var cardMap;
var dataJSON;

function readFile(evt) {
          //Retrieve the first (and only!) File from the FileList object
           var f = evt.target.files[0];
           var r = new FileReader();
           r.onload = function (content){
           var toHTMLDOM = convertToHTMLDOM(content);
           fetchVCardData(toHTMLDOM);
           }
           r.readAsText(f);
       }

function convertToHTMLDOM(content){
   return $.parseHTML(content.target.result);
}

function fetchVCardData(toHTMLDOM){
  cardMap = new Map();
   //fetch the side card dom element and store it in a map
   $.each(toHTMLDOM, (i, el) => {
     if(el.id == "content"){
       var element = el.getElementsByTagName('table');
         var vCardElement = element[0];
         for (var i = 2; i < vCardElement.tBodies[0].childNodes.length; i++) {
           if(typeof vCardElement.tBodies[0].childNodes[i].cells[0] != "undefined" && typeof vCardElement.tBodies[0].childNodes[i].cells[1] != "undefined")
               cardMap.set(vCardElement.tBodies[0].childNodes[i].cells[0].innerText,vCardElement.tBodies[0].childNodes[i].cells[1].innerText);
         }
     }
   })
   console.log("map: ", cardMap);
   console.log("JSON: ",  map_to_object(cardMap));
   dataJSON = map_to_object(cardMap);
}

//https://gist.github.com/davemackintosh/3b9c446e8681f7bbe7c5.js
function map_to_object(map) {
    const out = Object.create(null)
    map.forEach((value, key) => {
      if (value instanceof Map) {
        out[key] = map_to_object(value)
      }
      else {
        out[key] = value
      }
    })
    return out
  }

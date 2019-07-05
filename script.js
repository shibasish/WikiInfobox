var cardMap;
var dataJSON;
var nodes = [];
var edges = [];
var network = null;
var options = {
  nodes: {
    scaling: {
      min: 16,
      max: 32
    }
  },
  edges: {
    color: "green",
    smooth: false
  },
  physics: {
    barnesHut: {
      gravitationalConstant: -30000
    },
    stabilization: {
      iterations: 2500
    }
  }
};

document.getElementById('fileInput').addEventListener('change', readFile, false);

function readFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];
  var r = new FileReader();
  r.onload = function(content) {
    var toHTMLDOM = convertToHTMLDOM(content);
    fetchVCardData(toHTMLDOM);
    createNetwork()
  }
  r.readAsText(f);
}

function convertToHTMLDOM(content) {
  return $.parseHTML(content.target.result);
}

function fetchVCardData(toHTMLDOM) {
  cardMap = new Map();
  //fetch the side card dom element and store it in a map
  $.each(toHTMLDOM, (i, el) => {
    if (el.id == "content") {
      var element = el.getElementsByTagName('table');
      var vCardElement = element[0];
      for (var i = 2; i < vCardElement.tBodies[0].childNodes.length; i++) {
        if (typeof vCardElement.tBodies[0].childNodes[i].cells[0] != "undefined" && typeof vCardElement.tBodies[0].childNodes[i].cells[1] != "undefined")
          cardMap.set(vCardElement.tBodies[0].childNodes[i].cells[0].innerText, vCardElement.tBodies[0].childNodes[i].cells[1].innerText);
      }
    }
  })
  dataJSON = map_to_object(cardMap);
  console.log(dataJSON);
}

//https://gist.github.com/davemackintosh/3b9c446e8681f7bbe7c5.js
function map_to_object(map) {
  const out = Object.create(null)
  map.forEach((value, key) => {
    if (value instanceof Map) {
      out[key] = map_to_object(value)
    } else {
      out[key] = value
    }
  })
  return out
}

function createNetwork(){
  let counter = 0;
  cardMap.forEach((value, key) => {
    nodes.push({
      id: counter,
      label: `${{key:value}}`,
      shape: "triangle"
    })
    edges.push({
      from: 0,
      to: counter,
      label: "edge"
    })
    counter ++;
  })

  var container = document.getElementById('result');
  var data = {
    nodes: nodes,
    edges: edges
  };

  network = new vis.Network(container, data, options);
}

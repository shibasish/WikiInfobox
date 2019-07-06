var cardMap;
var nodes = [];
var edges = [];
var network = null;
var data = {
  nodes: nodes,
  edges: edges
};
var container = document.getElementById('result');

document.getElementById('fileInput').addEventListener('change', readFile, false);

function readFile(evt) {
  // if(container.childNodes.length>0){
  //   for(var i=0; i< container.childNodes.length;i++)
  //     container.removeChild(container.childNodes[i]);
  //   nodes = []; edges = [];
  // }
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];
  var r = new FileReader();
  r.onload = function(content) {
    var toHTMLDOM = convertToHTMLDOM(content);
    fetchVCardData(toHTMLDOM);
    createNetwork();
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
      for (var i = 1; i < vCardElement.tBodies[0].childNodes.length; i++) {
        if (i == 1) {
          cardMap.set("name", vCardElement.tBodies[0].childNodes[i].cells[0].innerText);
          console.log(vCardElement.tBodies[0].childNodes[i].cells[0]);
        }
        if (typeof vCardElement.tBodies[0].childNodes[i].cells[0] != "undefined" && typeof vCardElement.tBodies[0].childNodes[i].cells[1] != "undefined")
          cardMap.set(vCardElement.tBodies[0].childNodes[i].cells[0].innerText, vCardElement.tBodies[0].childNodes[i].cells[1].innerText);
      }
    }
  })
}

function createNetwork() {
  let counter = 0;
  cardMap.forEach((value, key) => {
    switch (true) {
      case counter == 0:
        nodes.push({
          id: counter,
          label: value,
          group: "root"
        })
        break;
      case (counter % 2 == 0):
        nodes.push({
          id: counter,
          label: value,
          group: "even"
        })
        break;
      case counter % 2 != 0:
        nodes.push({
          id: counter,
          label: value,
          group: "odd"
        })
    }

    edges.push({
      from: 0,
      to: counter,
      label: key
    })
    counter++;
  })
  var options = {
    physics: {
      barnesHut: {
        avoidOverlap: 1,
        springConstant: 0,
        centralGravity: 1,
      }
    },
    groups: {
      root: {
        shape: 'ellipse',
        color: '#e8d585' // orange
      },
      odd: {
        shape: 'ellipse',
        color: "#ff829d" // blue ff829d
      },
      even: {
        shape: 'ellipse',
        color: "#6fcdcd" // purple
      }
    }
  };
  network = new vis.Network(container, data, options);
}

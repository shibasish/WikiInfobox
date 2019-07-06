myFunc = function(){
  const properties = {
    "cardMap": null,
    "nodes": [],
    "edges": [],
    "network": null,
    "container": document.getElementById("result"),
    "networkOptions": {                     //  options property to customise the  graph
      physics: {
        barnesHut: {
          avoidOverlap: 1,
          springConstant: 0,
          centralGravity: 1,
        }
      },
      groups: {
        root: {
          shape: "ellipse",
          color: "#e8d585"
        },
        odd: {
          shape: "ellipse",
          color: "#ff829d"
        },
        even: {
          shape: "ellipse",
          color: "#6fcdcd"
        }
      }
    }
  }

  // add event handler callback function when a file is uploaded
  document.getElementById("fileInput").addEventListener("change", _readFile, false);

  //callback for file uopload, forms the main callback for the code flow
  function _readFile(evt) {
    //Retrieve the uploaded File
    const file = evt.target.files[0],
      fileReader = new FileReader();

    //callback once file loaded, the loaded file is in text format
    fileReader.onload = function(content) {

      // Step 1:  convert the textfile to obtain HTML DOM object to access the info section
      let toHTMLDOM = convertToHTMLDOM(content);

      // Step 2: create a map for the bio obtained via DOM acceess
      fetchVCardData(toHTMLDOM);

      // branch to reset the page, when a second file is uploaded
      if (properties.container.childNodes.length > 0) {
        resetPage();
      }

      //Step 3: create the network
      createNetwork();
    }
    fileReader.readAsText(file);
  }

  //used jquery :)
  function convertToHTMLDOM(content) {
    return $.parseHTML(content.target.result);
  }

  function fetchVCardData(toHTMLDOM) {
    properties.cardMap = new Map();
    let i;

    //fetch the side card dom element and store it in a map
    $.each(toHTMLDOM, (i, el) => {
      if (el.id === "content") {

        // the info section in wiki page is stored as table
        const infoTable = el.getElementsByTagName("table")[0].tBodies[0].childNodes;

        for (i = 1; i < infoTable.length; i++) {
          //the first cell does not have key.
          if (i === 1)
            properties.cardMap.set("name", infoTable[i].cells[0].innerText);

          if (typeof infoTable[i].cells[0] != "undefined" && typeof infoTable[i].cells[1] != "undefined")
            properties.cardMap.set(infoTable[i].cells[0].innerText, infoTable[i].cells[1].innerText);
        }
        return; // to break and not process further elements in the DOM
      }
    })
  }

  //use of vis.js
  function createNetwork() {
    let counter = 0, data;

    properties.cardMap.forEach((value, key) => {
      createNode(counter, value);
      connectNodes(counter, key);
      counter++;
    })

    data = {
      nodes: properties.nodes,
      edges: properties.edges
    };

    // all magic happens here, create the network canvas
    network = new vis.Network(properties.container, data, properties.networkOptions);
  }

  function createNode(counter, value) {
    switch (true) {
      case counter === 0:
        properties.nodes.push({
          id: counter,
          label: value,
          group: "root"
        })
        break;
      case (counter % 2 === 0):
        properties.nodes.push({
          id: counter,
          label: value,
          group: "even"
        })
        break;
      case (counter % 2 != 0):
        properties.nodes.push({
          id: counter,
          label: value,
          group: "odd"
        })
        break;
      default:
        break;
    }
  }

  function connectNodes(counter, key) {
    properties.edges.push({
      from: 0,
      to: counter,
      label: key
    })
  }

  function resetPage() {
    while (properties.container.firstChild) {
      properties.container.removeChild(properties.container.firstChild);
    }
    if (properties.nodes.length > 0 && properties.edges.length > 0) {
      properties.nodes.length = 0;
      properties.edges.length = 0;
    }
  }
}();

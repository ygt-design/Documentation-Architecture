const width = 960;
const height = 600;

const svg = document.querySelector("svg");

const data = {
  nodes: [
    { id: "Node 1", tag: "left,right" },
    { id: "Node 2", tag: "left" },
    { id: "Node 3", tag: "right,up" },
    { id: "Node 4", tag: "right" },
    { id: "Node 5", tag: "up,down" },
    { id: "Node 6", tag: "up" },
    { id: "Node 7", tag: "down" },
    { id: "Node 8", tag: "down" },
    { id: "Node 9", tag: "left" },
    { id: "Node 10", tag: "left,up" },
    { id: "Node 11", tag: "right" },
    { id: "Node 12", tag: "down" },
    { id: "Node 13", tag: "up" },
    { id: "Node 14", tag: "left" },
    { id: "Node 15", tag: "right,down" },
    { id: "Node 16", tag: "up" },
    { id: "Node 17", tag: "left,down" },
    { id: "Node 18", tag: "up" },
    { id: "Node 19", tag: "down,right" },
    { id: "Node 20", tag: "left" },
    { id: "Node 21", tag: "right,up" },
    { id: "Node 22", tag: "left,down" },
    { id: "Node 23", tag: "right" },
    { id: "Node 24", tag: "up" },
    { id: "Node 25", tag: "left,right" },
    { id: "Node 26", tag: "down" },
    { id: "Node 27", tag: "up" },
    { id: "Node 28", tag: "left" },
    { id: "Node 29", tag: "right" },
    { id: "Node 30", tag: "down" },
    { id: "Node 31", tag: "left,up" },
    { id: "Node 32", tag: "right" },
    { id: "Node 33", tag: "down,up" },
    { id: "Node 34", tag: "left" },
    { id: "Node 35", tag: "right" },
    { id: "Node 36", tag: "down" },
    { id: "Node 37", tag: "up,left" },
    { id: "Node 38", tag: "right" },
    { id: "Node 39", tag: "down" },
    { id: "Node 40", tag: "left" },
    { id: "Node 41", tag: "right" },
    { id: "Node 42", tag: "up" },
    { id: "Node 43", tag: "down" },
    { id: "Node 44", tag: "left" },
    { id: "Node 45", tag: "right" },
    { id: "Node 46", tag: "up" },
    { id: "Node 47", tag: "down" },
    { id: "Node 48", tag: "left,right" },
    { id: "Node 49", tag: "up,down" },
    { id: "Node 50", tag: "right" },
  ],
  links: [],
};

// Generate links based on tags
const tagGroups = {};

// Group nodes by tags
data.nodes.forEach((node) => {
  const tags = node.tag.split(",");
  tags.forEach((tag) => {
    if (!tagGroups[tag]) {
      tagGroups[tag] = [];
    }
    tagGroups[tag].push(node.id);
  });
});

// Create links between nodes with the same tag
for (const tag in tagGroups) {
  const nodes = tagGroups[tag];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      data.links.push({ source: nodes[i], target: nodes[j] });
    }
  }
}

// Create a map of nodes for quick lookup
const nodeMap = new Map();
data.nodes.forEach((node) => nodeMap.set(node.id, node));

// Create links
data.links.forEach((link) => {
  const sourceNode = nodeMap.get(link.source);
  const targetNode = nodeMap.get(link.target);
  const linkElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  linkElement.classList.add("link");
  linkElement.setAttribute("x1", sourceNode.x);
  linkElement.setAttribute("y1", sourceNode.y);
  linkElement.setAttribute("x2", targetNode.x);
  linkElement.setAttribute("y2", targetNode.y);
  svg.appendChild(linkElement);
});

// Create nodes
data.nodes.forEach((node) => {
  const nodeElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  nodeElement.classList.add("node");
  nodeElement.setAttribute("cx", Math.random() * width);
  nodeElement.setAttribute("cy", Math.random() * height);
  nodeElement.setAttribute("r", 5);
  nodeElement.setAttribute("fill", "blue");

  nodeElement.addEventListener("mouseover", () => handleMouseOver(node));
  nodeElement.addEventListener("mouseout", handleMouseOut);

  node.element = nodeElement;
  svg.appendChild(nodeElement);
});

function handleMouseOver(node) {
  const tags = node.tag.split(",");
  data.nodes.forEach((n) => {
    if (tags.some((tag) => n.tag.includes(tag))) {
      n.element.classList.add("highlighted");
      n.element.classList.remove("hidden");
    } else {
      n.element.classList.add("hidden");
      n.element.classList.remove("highlighted");
    }
  });

  data.links.forEach((link) => {
    const sourceNode = nodeMap.get(link.source);
    const targetNode = nodeMap.get(link.target);
    if (
      tags.some(
        (tag) => sourceNode.tag.includes(tag) && targetNode.tag.includes(tag)
      )
    ) {
      sourceNode.element.classList.add("highlighted");
      sourceNode.element.classList.remove("hidden");
      targetNode.element.classList.add("highlighted");
      targetNode.element.classList.remove("hidden");
    }
  });
}

function handleMouseOut() {
  data.nodes.forEach((n) => {
    n.element.classList.remove("hidden");
    n.element.classList.remove("highlighted");
  });
}

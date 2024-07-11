const width = window.innerWidth || 1200;
const height = window.innerHeight || 800;
const linkDistance = 100;
const charge = -40;

const tags = ["left", "right", "up", "down"];

const sortNodesByTag = (nodes) => {
  const sortedNodes = [];
  tags.forEach((tag) => {
    nodes.forEach((node) => {
      if (node.tag.includes(tag)) {
        sortedNodes.push(node);
      }
    });
  });
  return sortedNodes;
};

const getLinkColor = (sourceTag, targetTag) => {
  if (sourceTag.includes("left") && targetTag.includes("right")) return "red";
  if (sourceTag.includes("right") && targetTag.includes("left")) return "blue";
  if (sourceTag.includes("up") && targetTag.includes("down")) return "green";
  if (sourceTag.includes("down") && targetTag.includes("up")) return "orange";
  return "white"; // default color
};

// Function to set center forces based on tags
const getCenterForce = (tag) => {
  if (tag.includes("left")) return [width / 4, height / 2];
  if (tag.includes("right")) return [(3 * width) / 4, height / 2];
  if (tag.includes("up")) return [width / 2, height / 4];
  if (tag.includes("down")) return [width / 2, (3 * height) / 4];
  return [width / 2, height / 2]; // default center
};

// Load JSON data
d3.json("data.json").then((graph) => {
  let nodes = graph.nodes.map((d) => ({ id: d.id, tag: d.tag }));
  nodes = sortNodesByTag(nodes);

  const links = [];

  // Create links based on the sorted nodes
  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      sourceTag: nodes[i].tag,
      targetTag: nodes[i + 1].tag,
    });
  }

  const svg = d3
    .select("#network")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(linkDistance)
    )
    .force("charge", d3.forceManyBody().strength(charge))
    .force(
      "x",
      d3.forceX().x((d) => {
        if (d.tag.includes("left")) return width / 4;
        if (d.tag.includes("right")) return (3 * width) / 4;
        return width / 2;
      })
    )
    .force(
      "y",
      d3.forceY().y((d) => {
        if (d.tag.includes("up")) return height / 4;
        if (d.tag.includes("down")) return (3 * height) / 4;
        return height / 2;
      })
    )
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", (d) => getLinkColor(d.sourceTag, d.targetTag));

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  const label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .text((d) => d.tag); // Display the tags instead of the IDs

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    label.attr("x", (d) => d.x + 6).attr("y", (d) => d.y - 6);
  });

  simulation.force("link").links(links);

  function handleMouseOver(event, d) {
    // Dim all nodes and links
    d3.selectAll(".node").style("opacity", 0.2);
    d3.selectAll(".link").style("opacity", 0.2);
    d3.selectAll(".label").style("opacity", 0.2);

    // Highlight the hovered node and its links
    d3.select(this).style("fill", "yellow").style("opacity", 1);
    d3.selectAll(".link")
      .filter((l) => l.source.id === d.id || l.target.id === d.id)
      .style("stroke", "yellow")
      .style("opacity", 1);

    // Highlight nodes and labels with the same tag
    const tags = d.tag.split(",");
    tags.forEach((tag) => {
      d3.selectAll(".node")
        .filter((n) => n.tag.includes(tag))
        .style("fill", "yellow")
        .style("opacity", 1);
      d3.selectAll(".label")
        .filter((n) => n.tag.includes(tag))
        .style("fill", "yellow")
        .style("opacity", 1);
    });
  }

  function handleMouseOut() {
    d3.selectAll(".node").style("fill", "rgb(255, 0, 255)").style("opacity", 1);
    d3.selectAll(".link")
      .style("stroke", (d) => getLinkColor(d.sourceTag, d.targetTag))
      .style("opacity", 1);
    d3.selectAll(".label").style("fill", "magenta").style("opacity", 1);
  }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});

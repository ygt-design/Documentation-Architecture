const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3.forceLink().id((d) => d.id)
  )
  .force("charge", d3.forceManyBody().strength(-400))
  .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("graph.json").then((graph) => {
  // Generate links based on tags
  const links = [];
  const tagGroups = {};

  // Group nodes by tags
  graph.nodes.forEach((node) => {
    const tags = node.tag.split(","); // Assume tags are comma-separated
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
        links.push({ source: nodes[i], target: nodes[j] });
      }
    }
  }

  graph.links = links;

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "link");

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .attr("fill", "blue") // Set all nodes to the same color
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  node.append("title").text((d) => d.id);

  simulation.nodes(graph.nodes).on("tick", ticked);
  simulation.force("link").links(graph.links);

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
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

  function handleMouseOver(event, d) {
    // Get tags of the hovered node
    const tags = d.tag.split(",");

    // Highlight nodes and links
    node.classed("hidden", (n) => !tags.some((tag) => n.tag.includes(tag)));
    node.classed("highlighted", (n) => tags.some((tag) => n.tag.includes(tag)));

    link.classed(
      "hidden",
      (l) =>
        !tags.some(
          (tag) => l.source.tag.includes(tag) || l.target.tag.includes(tag)
        )
    );
  }

  function handleMouseOut() {
    // Reset nodes and links to default state
    node.classed("hidden", false).classed("highlighted", false);
    link.classed("hidden", false);
  }
});

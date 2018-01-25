import * as d3 from "d3";
import {inject} from 'aurelia-framework';
import riderService from '../../services/riderService';


@inject(riderService)
export class socialGraph {

  nodes = [];
  links = [];

  constructor(rs) {
    this.riderService = rs;
  }

  attached() {

    this.riderService.getUserList().then ( res => {

      this.userList = res.content;

      for (let i = 0; i < this.userList.length; i++) {
        this.nodes.push({"id": this.userList[i].userName});
      }

      for (let i = 0; i < this.userList.length; i++) {
        for (let j = 0; j < this.userList[i].friends.length; j++) {
          /* failsafe */
          if (this.userList[i] === null)
            continue;
          /* find username of friend */
          for (let k = 0; k < this.userList.length; k++) {
            if (this.userList[k]._id === this.userList[i].friends[j]) {
              this.links.push({"source": this.userList[i].userName, "target": this.userList[k].userName});
            }
          }
        }

      }
    }).then ( x => {
      
    var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function (d) {
        return d.id;
      }), d3.forceLink().distance(function(d) {
        return d.distance;}).strength(0.1))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));


    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.links)
      .enter().append("line")
      .attr("stroke-width", function (d) {
        return Math.sqrt(d.value);
      });

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(this.nodes)
      .enter().append("circle")
      .attr("r", 10)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .attr("fill", function (d) {
        return color(d.group);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("title")
      .text(function (d) {
        return d.id;
      });

    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.id });

    simulation
      .nodes(this.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(this.links).distance(200);

    function ticked() {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function mouseover() {
      d3.select(this).select("circle").transition()
        .duration(750)
        .attr("text", "honolulu");
    }

    function mouseout() {
      d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 8);
    }
  });

  }

}



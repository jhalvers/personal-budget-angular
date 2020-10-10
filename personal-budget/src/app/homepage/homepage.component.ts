import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {Chart} from 'chart.js';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

public dataSource = {
  datasets: [
    {
        data: [],
        backgroundColor: [
            '#ffcd56',
            '#ff6384',
            '#36a2eb',
            '#fd6b19',
            '#56fffc',
            '#ff56f4',
            '#39ad45'
        ],
    }
],
labels: []
};
private svg;
  private margin = 50;
  private width = 750;
  private height = 600;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;


  constructor(private http: HttpClient, public dataService: DataService) {
    this.dataService.returnData();
   }

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}

private createColors(data): void {
  this.colors = d3.scaleOrdinal()
  .domain(data.map(d => d.budget))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}

private drawChart(data): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.value));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d, i) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('text')
  .text(d => d.data.label)
  .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {

      this.createChart();
      this.createSvg();
      this.createColors(this.dataService.d3Data);
      this.drawChart(this.dataService.d3Data);
    });
  }

  createChart() {
    // var ctx = document.getElementById("myChart").getContext("2d");
    let ctx : any = document.getElementById('myChart') as HTMLCanvasElement;
    let myPieChart = new Chart(ctx, {
    type: 'pie',
    data: this.dataService.dataSource
});
}
}


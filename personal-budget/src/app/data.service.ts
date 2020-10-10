import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
    if(this.dataSource.labels.length === 0)
    {
      this.returnData();
    }
   }

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

  public d3Data;

  returnData(){
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      let data = this.dataSource.datasets[0].data;
      let labels = this.dataSource.labels;

      function randomData (){
        return labels.map(function(label, i){
          return { label: label, value: data[i]}
        })
      }
      this.d3Data=randomData();
      //this.createColors(this.dataService.secondData);
      //this.drawChart(this.dataService.secondData);
    });
  }

}

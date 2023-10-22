import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatapassService {

  constructor(private http :HttpClient) { }

  public search = new BehaviorSubject<string>("");

  getProduct(){
    // return this.http.get<any>("https://zenanvibe.com/siraj/getdata.php")
    return this.http.get<any>("https://zenanvibe.com/inseatfood_ram/getdata.php")
    .pipe(map(res=>{
      return res;
    }))
  }}

  
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Collectible } from '../model/collectible.model';

@Injectable()
export class CollectibleService {
  rootUrl=(environment.production?'https://omnifans.net':'http://localhost:3001')
  route=(this.rootUrl+'/api/v1/collectibles')
  constructor(private http: HttpClient) {
  }

  getCollectibles({conditions}):Observable<Collectible[]>{
    let strCond=(conditions?'?conditions='+JSON.stringify(conditions):'')
    return this.http.get<Collectible[]>(this.route+strCond).pipe(
      map((response)=>{
        return response
      })
    );
  }

  createCollectible(collectible:Collectible):Observable<Collectible>{
    return this.http.post<Collectible>(this.route,collectible).pipe(
      map((response)=>{
        return response
      })
    );
  }
  getCollectible(id:string):Observable<Collectible>{
    return this.http.get<Collectible>(this.route+'/'+id).pipe(
      map((response)=>{
        return response
      })
    );
  }
  updateCollectible(collectible:Collectible):Observable<Collectible>{
    return this.http.put<Collectible>(this.route+'/'+collectible._id,collectible).pipe(
      map((response)=>{
        return response
      })
    );
  }

}

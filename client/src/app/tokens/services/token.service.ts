import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Token } from '../model/token.model';

@Injectable()
export class TokenService {
  rootUrl=(environment.production?'https://omnifans.net':'http://localhost:3001')
  route=(this.rootUrl+'/api/v1/tokens')
  constructor(private http: HttpClient) {
  }

  getTokens():Observable<Token[]>{
    return this.http.get<Token[]>(this.route).pipe(
      map((response)=>{
        return response
      })
    );
  }

  createToken(token:Token):Observable<Token>{
    return this.http.post<Token>(this.route,token).pipe(
      map((response)=>{
        return response
      })
    );
  }
  getToken(id:string):Observable<Token>{
    return this.http.get<Token>(this.route+'/'+id).pipe(
      map((response)=>{
        return response
      })
    );
  }
  updateToken(token:Token):Observable<Token>{
    return this.http.put<Token>(this.route+'/'+token._id,token).pipe(
      map((response)=>{
        return response
      })
    );
  }
  getOwnerToken(owner: string): Observable<Token[]> {
    return this.http.get<Token[]>(this.route+'?conditions='+JSON.stringify({owner}));
  }

}

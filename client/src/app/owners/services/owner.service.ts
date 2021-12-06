import { Owner, OwnerLoginResponse } from '../model/owner.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OmniFansService } from 'src/app/omnifan/services/omnifan.service';
import { environment } from '../../../environments/environment';


@Injectable()
export class OwnerService {
  rootUrl=(environment.production?'https://omnifans.net':'http://localhost:3001')
  route=(this.rootUrl+'/api/v1/owners')

  constructor(private http: HttpClient,
    private omniFanService:OmniFansService,

    ) {
  }

  getAllOwners(): Observable<Owner[]> {
    return this.http.get<Owner[]>(this.route).pipe(
      map((response)=>{
        return response
      })
    );
  }

  createOwner(owner: Owner): Observable<Owner> {
    return this.http.post<Owner>(this.route, owner);
  }

  deleteOwner(ownerId: string): Observable<any> {
    return this.http.delete(this.route+'/' + ownerId);
  }
  getOwnerByEmail(email: string): Observable<Owner[]> {
    return this.http.get<Owner[]>(this.route+'?conditions='+JSON.stringify({email}));
  }


  updateOwner(ownerId: string | number, changes: Partial<Owner>): Observable<any> {
    return this.http.put(this.route+'/' + ownerId, changes);
  }

  getOwnerByPublicAddress(publicAddress:string):Observable<Owner>{
    return this.http.get<Owner>(this.route+'/getOwnerByPublicAddress/'+publicAddress);
  }

   getOwnerPublicAddress():Observable<string>{
    return this.omniFanService.getOwnerPublicAddress();
  }

  signOwnerNonce(owner:Owner):Observable<Owner>{
    return this.omniFanService.signOwnerNonce(owner);
  } 

  login(owner:Owner):Observable<OwnerLoginResponse>{
    return this.http.post<OwnerLoginResponse>(this.route+'/login',owner);
  }
  register(owner:Owner):Observable<Owner>{
    return this.http.post<Owner>(this.route,owner);
  }

  updateOwnerProfile(owner:Owner):Observable<Owner>{
    return this.http.put<Owner>(this.route+'/'+owner._id,owner);
  }




}

import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor,HttpRequest,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import { ToastService } from "../toasts/toast.service";
import { Router } from "@angular/router";

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(private toastService:ToastService,private router:Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case 401:
              this.toastService.warning("You are trying to access an unauthorised link, please login first")
              this.router.navigate(['/login-owner'])
              break;
          case 500:
              this.toastService.warning(error?.error?.error)
              break;
      }
        return throwError(error.message);
      })
    )
  }
}

import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];
  success(text:string){
    this.show(text, { classname: 'bg-success text-light', delay: 5000,autohide:true });
  }
  warning(text:string){
    this.show(text, { classname: 'bg-warning text-light', delay: 5000, autohide:true });
  }
  error(text:string){
    console.log(text);
    this.show(text, { classname: 'bg-danger text-light', delay: 5000,autohide:true });
  }
  info(text:string){
    this.show(text, { classname: 'bg-info text-light', delay: 5000,autohide:true });
  }
  standard(text:string){
    this.show(text);
  }

  private show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}

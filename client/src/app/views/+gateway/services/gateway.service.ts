import { Injectable } from '@angular/core';

import {environment as env} from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllGateways(): Observable<any> {
    return this.httpClient.get(`${env.apiURL}/gateway`);
  }
}

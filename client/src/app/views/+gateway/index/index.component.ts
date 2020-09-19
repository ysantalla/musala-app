import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, OnInit, AfterContentInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Gateway } from '@app/core/interface/gateway.interface';

import {environment as env} from '@env/environment';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})
export class IndexComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'serialNumber', 'ipAddress'];
  apiDatabase: ApiHttpDatabase | null;
  data: Gateway[] = [];

  resultsLength = 0;
  itemsxpage = 2;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient) {}

  ngAfterViewInit() {
    this.apiDatabase = new ApiHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apiDatabase!.getGateways(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }
}

interface ApiGateways {
  items: Gateway[];
  count: number;
}

/** An api database that the data source uses to retrieve data for the table. */
export class ApiHttpDatabase {

  constructor(private _httpClient: HttpClient) {}

  getGateways(sortBy: string, order: string, page: number, limit: number): Observable<ApiGateways> {
    return this._httpClient.get<ApiGateways>(`${env.apiURL}/gateway?skip=${page}&limit=${limit}`);
  }
}

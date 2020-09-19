import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { IndexComponent } from './index/index.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: {title: 'Gateway list'},
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IndexComponent]
})
export class GatewayModule {}

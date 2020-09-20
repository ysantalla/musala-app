import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GatewayService } from '../services/gateway.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Gateway } from '@app/core/interfaces/gateway.interface';

@Component({
  selector: 'app-managment-devices-modal',
  templateUrl: './managment-devices-modal.component.html',
  styleUrls: ['./managment-devices-modal.component.scss']
})
export class ManagmentDevicesModalComponent implements OnInit {

  addDeviceForm: FormGroup;
  loading = false;

  gateway: Gateway;

  reloadData: Subject<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private gatewayService: GatewayService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reloadData = new Subject<boolean>();

    this.gateway = data.gateway;
  }

  ngOnInit(): void {
    this.addDeviceForm = this.formBuilder.group({
      uid: ['', Validators.required],
      vendor: ['', Validators.required],
      status: ['', Validators.required],
      dateCreated: ['', Validators.required],
    });

    this.addDeviceForm.disable();

    this.reloadData.subscribe(data => {
      this.gatewayService.getOneGateway(this.gateway._id).subscribe(data => {
        this.gateway = data;
      }, (response: HttpErrorResponse) => {
        this.snackBar.open(response.error.message, 'X', {duration: 3000});
      });

    });
  }

  enable(): void {
    this.addDeviceForm.enable();
  }

  onAddDevice(): void {

    if (this.addDeviceForm.valid) {
      this.gatewayService.addDevice(this.data.gateway._id, {
        status: this.addDeviceForm.value.status,
        vendor: this.addDeviceForm.value.vendor,
        uid: this.addDeviceForm.value.uid,
        dateCreated: new Date(this.addDeviceForm.value.dateCreated).getTime(),
      }).subscribe(data => {
        this.snackBar.open('Adding peripheral device', 'X', {duration: 3000});
        this.reloadData.next(true);
      }, (response: HttpErrorResponse) => {
        this.snackBar.open(response.error.message, 'X', {duration: 3000});
      });
    }
  }

  removeDevice(gatewayID: string, deviceID: string): void {
    console.log(gatewayID, deviceID);
  }

}

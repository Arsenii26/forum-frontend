import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import Cropper from 'cropperjs';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
// This component has ability to crop image and convert it to base64 String (don't using in this version)
export class ImageCropperComponent implements OnInit {

  @ViewChild('image', { static: false })
  public imageElement: ElementRef;

  @Input('src')
  public imageSource: string;

  public imageDestination: string;
  private cropper: Cropper;

  public constructor() {
    this.imageDestination = '';
  }

  public ngAfterViewInit() {
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: false,
      scalable: false,
      aspectRatio: 1,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas();
        this.imageDestination = canvas.toDataURL('image/png');
      }
    });
  }

  public ngOnInit() { }
}

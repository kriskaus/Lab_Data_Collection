import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTableComponentComponent } from './file-table.component';

describe('FileTableComponentComponent', () => {
  let component: FileTableComponentComponent;
  let fixture: ComponentFixture<FileTableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTableComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

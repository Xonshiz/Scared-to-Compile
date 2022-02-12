import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMenuComponent } from './board-menu.component';

describe('BoardMenuComponent', () => {
  let component: BoardMenuComponent;
  let fixture: ComponentFixture<BoardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

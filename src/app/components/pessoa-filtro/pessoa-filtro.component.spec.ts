import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoaFiltroComponent } from './pessoa-filtro.component';

describe('PessoaFiltroComponent', () => {
  let component: PessoaFiltroComponent;
  let fixture: ComponentFixture<PessoaFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PessoaFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

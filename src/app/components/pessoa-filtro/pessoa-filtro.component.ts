import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pessoa-filtro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pessoa-filtro.component.html',
  styleUrl: './pessoa-filtro.component.css',
})
export class PessoaFiltroComponent implements OnInit {
  filtroForm!: FormGroup;
  resultados: any[] = [];
  carregando = false;
  erro: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      nome: [''],
      sexo: [''],
      idadeMin: [''],
      idadeMax: [''],
    });
  }

  buscar(): void {
    this.carregando = true;
    this.erro = null;
    this.resultados = [];

    const filtros = this.filtroForm.value;

    let params = new HttpParams();

    if (filtros.nome) {
      params = params.set('nome', filtros.nome);
    }
    if (filtros.sexo) {
      params = params.set('sexo', filtros.sexo);
    }
    if (filtros.idadeMin) {
      params = params.set('idadeMin', filtros.idadeMin);
    }
    if (filtros.idadeMax) {
      params = params.set('idadeMax', filtros.idadeMax);
    }

    const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro';

    this.http.get<any>(url, { params }).subscribe({
      next: (res) => {
        this.resultados = res.content || [];
        this.carregando = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao buscar pessoas.';
        this.carregando = false;
      },
    });
  }
}

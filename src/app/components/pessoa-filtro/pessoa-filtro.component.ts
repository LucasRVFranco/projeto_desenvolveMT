import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';

type Sexo = 'MASCULINO' | 'FEMININO';
type Status = 'DESAPARECIDO' | 'LOCALIZADO';

interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  sexo: Sexo;
  vivo: boolean;
  urlFoto?: string | null;
  ultimaOcorrencia?: {
    dtDesaparecimento?: string;
    dataLocalizacao?: string | null;
    encontradoVivo?: boolean | null;
    localDesaparecimentoConcat?: string | null;
    ocoId?: number;
    listaCartaz?: { urlCartaz: string; tipoCartaz: string }[];
    ocorrenciaEntrevDesapDTO?: {
      informacao?: string | null;
      vestimentasDesaparecido?: string | null;
    };
  };
}

@Component({
  selector: 'app-pessoa-filtro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './pessoa-filtro.component.html',
  styleUrls: ['./pessoa-filtro.component.css'],
})
export class PessoaFiltroComponent implements OnInit {
  filtroForm!: FormGroup;
  carregando = false;
  erro: string | null = null;

  readonly PAGE_SIZE = 10;
  readonly MAX_PAGES = 3;

  private allResultados = signal<Pessoa[]>([]);
  currentPage = signal<number>(1);

  pageItems = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.PAGE_SIZE;
    return this.allResultados().slice(start, start + this.PAGE_SIZE);
  });

  totalPages = computed(() => {
    const pages = Math.ceil(this.allResultados().length / this.PAGE_SIZE);
    return Math.min(pages || 1, this.MAX_PAGES);
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      nome: [''],
      sexo: [''],
      status: [''],
      idadeMin: [''],
      idadeMax: [''],
    });

    this.carregarDinamicoInicial();
  }

  private carregarDinamicoInicial(): void {
    this.carregando = true;
    this.erro = null;

    const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/dinamico';
    const params = new HttpParams().set('registros', '30');

    this.http.get<Pessoa[]>(url, { params }).subscribe({
      next: (lista) => {
        const limpo = Array.isArray(lista)
          ? lista.filter((p) => p && p.id != null)
          : [];
        this.allResultados.set(limpo);
        this.currentPage.set(1);
        this.carregando = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Não foi possível carregar os desaparecidos iniciais.';
        this.carregando = false;
      },
    });
  }

  buscar(): void {
    this.carregando = true;
    this.erro = null;

    const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro';

    const f = this.filtroForm.value;
    let params = new HttpParams();
    if (f.nome) params = params.set('nome', f.nome);
    if (f.sexo) params = params.set('sexo', f.sexo);
    if (f.idadeMin) params = params.set('idadeMin', f.idadeMin);
    if (f.idadeMax) params = params.set('idadeMax', f.idadeMax);

    this.http
      .get<{ content?: Pessoa[] } | Pessoa[]>(url, { params })
      .subscribe({
        next: (res) => {
          const lista = Array.isArray(res) ? res : res?.content ?? [];
          const limpo = Array.isArray(lista)
            ? lista.filter((p) => p && p.id != null)
            : [];
          this.allResultados.set(
            limpo.slice(0, this.MAX_PAGES * this.PAGE_SIZE)
          );
          this.currentPage.set(1);
          this.carregando = false;
        },
        error: (err) => {
          console.error(err);
          this.erro = 'Erro ao buscar pessoas com os filtros.';
          this.carregando = false;
        },
      });
  }

  setPage(p: number): void {
    if (p >= 1 && p <= this.totalPages()) this.currentPage.set(p);
  }
  prev(): void {
    this.setPage(this.currentPage() - 1);
  }
  next(): void {
    this.setPage(this.currentPage() + 1);
  }

  foto(p: Pessoa): string {
    return p?.urlFoto && p.urlFoto.trim() !== ''
      ? p.urlFoto
      : '/desaparecido.jpg';
  }
  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = '/desaparecido.jpg';
  }
  dataDesap(p: Pessoa): string {
    const dt = p?.ultimaOcorrencia?.dtDesaparecimento;
    return dt ? new Date(dt).toLocaleDateString() : '-';
  }
  local(p: Pessoa): string {
    return p?.ultimaOcorrencia?.localDesaparecimentoConcat || '-';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

type Sexo = 'MASCULINO' | 'FEMININO';

interface DetalhePessoa {
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
    ocorrenciaEntrevDesapDTO?: {
      informacao?: string | null;
      vestimentasDesaparecido?: string | null;
    };
    listaCartaz?: { urlCartaz: string; tipoCartaz: string }[];
    ocoId?: number;
  };
}

@Component({
  selector: 'app-pessoa-detalhe',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, ReactiveFormsModule],
  templateUrl: './pessoa-detalhe.component.html',
  styleUrls: ['./pessoa-detalhe.component.css'],
})
export class PessoaDetalheComponent implements OnInit {
  pessoa?: DetalhePessoa;
  carregando = true;
  erro: string | null = null;

  mostrarFormulario = false;

  infoForm!: FormGroup;
  anexos: File[] = [];
  enviando = false;
  sucessoMsg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro = 'ID inválido.';
      this.carregando = false;
      return;
    }

    this.http
      .get<DetalhePessoa>(`https://abitus-api.geia.vip/v1/pessoas/${id}`)
      .subscribe({
        next: (p) => {
          this.pessoa = p;
          this.infoForm = this.fb.group({
            informacao: ['', Validators.required],
            descricao: ['', Validators.required],
            data: ['', Validators.required],
            ocoId: [p?.ultimaOcorrencia?.ocoId ?? null, Validators.required],
          });
          this.carregando = false;
        },
        error: (e) => {
          console.error(e);
          this.erro = 'Erro ao carregar detalhes.';
          this.carregando = false;
        },
      });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.sucessoMsg = '';
      this.erro = '';
    }
  }

  foto(): string {
    return this.pessoa?.urlFoto && this.pessoa.urlFoto.trim() !== ''
      ? this.pessoa.urlFoto
      : '/desaparecido.jpg';
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = '/desaparecido.jpg';
  }

  dataDesap(): string {
    const d = this.pessoa?.ultimaOcorrencia?.dtDesaparecimento;
    return d
      ? new Date(d).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';
  }

  onFilesSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.anexos = input.files ? Array.from(input.files) : [];
  }

  enviarInformacao() {
    if (!this.infoForm.valid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    this.enviando = true;
    this.sucessoMsg = null;
    this.erro = null;

    const { informacao, descricao, data, ocoId } = this.infoForm.value;

    let params = new HttpParams()
      .set('informacao', informacao)
      .set('descricao', descricao)
      .set('data', data)
      .set('ocoId', String(ocoId));

    const formData = new FormData();
    this.anexos.forEach((f) => formData.append('files', f));

    const url =
      'https://abitus-api.geia.vip/v1/ocorrencias/informacoes-desaparecido';

    this.http.post(url, formData, { params }).subscribe({
      next: () => {
        this.sucessoMsg = 'Informações enviadas com sucesso!';
        this.enviando = false;
        this.anexos = [];
        this.infoForm.patchValue({ informacao: '', descricao: '', data: '' });
      },
      error: (e) => {
        console.error(e);
        this.erro =
          'Falha ao enviar informações. Verifique os dados e tente novamente.';
        this.enviando = false;
      },
    });
  }

  private formatarDataISO(d?: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  statusPessoa() {
    const p = this.pessoa;
    const oc = p?.ultimaOcorrencia;

    if (oc?.dataLocalizacao) {
      const obito = oc.encontradoVivo === false || p?.vivo === false;
      return {
        tipo: obito ? ('LOCALIZADO_OBITO' as const) : ('LOCALIZADO' as const),
        label: obito ? 'Localizado — Óbito' : 'Localizado',
        classe: obito ? 'status obito' : 'status localizado',
        detalhe: `Localizado em ${this.formatarDataISO(oc.dataLocalizacao)}`,
      };
    }

    return {
      tipo: 'DESAPARECIDO' as const,
      label: 'Desaparecido',
      classe: 'status desaparecido',
      detalhe: oc?.dtDesaparecimento
        ? `Desaparecido desde ${this.formatarDataISO(oc.dtDesaparecimento)}`
        : 'Sem data registrada',
    };
  }
}

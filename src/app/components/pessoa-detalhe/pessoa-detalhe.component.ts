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

  // --- formulário de envio de informação/anexos ---
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
          // cria o form já com o ocoId (se existir)
          this.infoForm = this.fb.group({
            informacao: ['', Validators.required],
            descricao: ['', Validators.required],
            data: ['', Validators.required], // yyyy-MM-dd
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

  // imagem
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
    return d ? new Date(d).toLocaleString() : '-';
  }

  // anexos
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

    // params em query string
    let params = new HttpParams()
      .set('informacao', informacao)
      .set('descricao', descricao)
      .set('data', data) // formato yyyy-MM-dd
      .set('ocoId', String(ocoId));

    // body multipart com os arquivos
    const formData = new FormData();
    this.anexos.forEach((f) => formData.append('files', f)); // nome do campo: files

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
}

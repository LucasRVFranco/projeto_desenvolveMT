import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './pessoa-detalhe.component.html',
  styleUrls: ['./pessoa-detalhe.component.css'],
})
export class PessoaDetalheComponent implements OnInit {
  pessoa?: DetalhePessoa;
  carregando = true;
  erro: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro = 'ID inválido.';
      this.carregando = false;
      return;
    }
    const url = `https://abitus-api.geia.vip/v1/pessoas/${id}`;
    this.http.get<DetalhePessoa>(url).subscribe({
      next: (p) => {
        this.pessoa = p;
        this.carregando = false;
      },
      error: (e) => {
        console.error(e);
        this.erro = 'Erro ao carregar detalhes.';
        this.carregando = false;
      },
    });
  }

  foto(): string {
    // fallback se não vier urlFoto
    return this.pessoa?.urlFoto && this.pessoa.urlFoto.trim() !== ''
      ? this.pessoa.urlFoto
      : '/desaparecido.jpg'; // imagem em public/desaparecido.jpg
  }

  onImgError(ev: Event) {
    // fallback se a URL remota quebrar
    const img = ev.target as HTMLImageElement;
    img.src = '/desaparecido.jpg';
  }

  dataDesap(): string {
    const d = this.pessoa?.ultimaOcorrencia?.dtDesaparecimento;
    return d ? new Date(d).toLocaleString() : '-';
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estatistico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estatistico.component.html',
  styleUrl: './estatistico.component.css',
})
export class EstatisticoComponent implements OnInit {
  desaparecidos: number | null = null;
  encontrados: number | null = null;
  erro: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/estatistico';

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.desaparecidos = res.quantPessoasDesaparecidas;
        this.encontrados = res.qauntPessoasEncontradas;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar os dados';
        console.error(err);
      },
    });
  }
}

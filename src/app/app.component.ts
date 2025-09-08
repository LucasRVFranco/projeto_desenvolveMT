import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { EstatisticoComponent } from "./components/estatistico/estatistico.component";
import { PessoaFiltroComponent } from "./components/pessoa-filtro/pessoa-filtro.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, EstatisticoComponent, PessoaFiltroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'desenvolveMt';
}

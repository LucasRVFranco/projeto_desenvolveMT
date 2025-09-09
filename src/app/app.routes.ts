import { Routes } from '@angular/router';

export const routes = [
  {
    // Home: lista + filtros
    path: '',
    loadComponent: () =>
      import('./components/pessoa-filtro/pessoa-filtro.component').then(
        (m) => m.PessoaFiltroComponent
      ),
  },
  {
    // Detalhe
    path: 'pessoa/:id',
    loadComponent: () =>
      import('./components/pessoa-detalhe/pessoa-detalhe.component').then(
        (m) => m.PessoaDetalheComponent
      ),
  },
  { path: '**', redirectTo: '' },
];

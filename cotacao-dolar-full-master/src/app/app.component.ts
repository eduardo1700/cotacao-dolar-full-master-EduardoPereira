import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  cotacaoAtual = 0;
  cotacaoPorPeriodoLista: Cotacao[] = [];
  data: string | Date = new Date();
  dataInicial!: string | Date;
  dataFinal!: string | Date;

  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe
  ) {}

  public getCotacaoPorPeriodo(
    dataInicialString: string,
    dataFinalString: string
  ): void {
    if (!dataInicialString || !dataFinalString) {
      console.error('Data inicial e final são obrigatórias.');
      return;
    }

    this.cotacaoPorPeriodoLista = [];

    const dataInicial = this.dateFormat.transform(dataInicialString, 'MM-dd-yyyy') || '';
    const dataFinal = this.dateFormat.transform(dataFinalString, 'MM-dd-yyyy') || '';

    if (dataInicial && dataFinal && dataInicial < dataFinal && new Date(dataFinal) <= this.data) {
      this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal).subscribe((cotacoes) => {
        this.cotacaoPorPeriodoLista = cotacoes;
      });
    } else if (dataInicial && dataFinal && dataFinal && new Date(dataFinal) > this.data) {
      // Show an error message because dataFinal must not be after the current date
      console.error('A data final não pode ser posterior à data atual.');
    } else {
      // Show an error message because dataFinal must be after dataInicial
      console.error('A data final deve ser posterior à data inicial.');
    }
  }
  mostrarCotacoesMenores: boolean = false;

  toggleCotacoesMenores() {
    this.mostrarCotacoesMenores = this.mostrarCotacoesMenores;
  }

  calcularDiferenca(preco: number): number {
    return this.cotacaoAtual - preco;
  }

  ngOnInit() {
    this.cotacaoDolarService.getCotacaoAtual().subscribe((cotacao) => {
      this.cotacaoAtual = cotacao.preco;
      console.log(cotacao);
    });

    const currentDate = new Date();
    // Set dataInicial to the first day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.dataInicial = this.dateFormat.transform(firstDayOfMonth, 'yyyy-MM-dd') || '';

    // Set dataFinal to the current date
    this.dataFinal = this.dateFormat.transform(currentDate, 'yyyy-MM-dd') || '';

    this.getCotacaoPorPeriodo(this.dataInicial, this.dataFinal);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cotacao } from './cotacao';

//alteração feita porque cotação de dolar atual no header estava a aparecer como object Object
interface CotacaoResponse {
  preco: number;
}

@Injectable({ providedIn: 'root' })
export class CotacaoDolarService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getCotacaoAtual(): Observable<CotacaoResponse> {
    return this.http.get<CotacaoResponse>(`${this.apiServerUrl}/moeda/atual`);
  }

  public getCotacaoPorPeriodoFront(
    dataInicial: string,
    dataFinal: string
  ): Observable<Cotacao[]> {
    return this.http.get<Cotacao[]>(`${this.apiServerUrl}/moeda/${dataInicial}&${dataFinal}`);
  }
}

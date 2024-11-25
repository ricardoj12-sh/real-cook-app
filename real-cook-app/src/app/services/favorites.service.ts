import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = `${environment.apiBackendUrl}/favorites`; // URL base del backend

  constructor(private http: HttpClient) {}

  getFavorites(user: string): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { params: { user } });
  }

  addFavorite(user: string, recipeId: number): Observable<any> {
    return this.http.post(this.apiUrl, { user, recipeId });
  }

  deleteFavorite(user: string, recipeId: number): Observable<any> {
    return this.http.request('delete', this.apiUrl, {
      body: { user, recipeId },
    });
  }

  getAllFavoriteRecipes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Obtener favoritos paginados
  getFavoritesPaginated(start: number, end: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, {
      params: {
        _start: start.toString(),
        _end: end.toString(),
      },
    });
  }

  countFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/count`);
  }
}

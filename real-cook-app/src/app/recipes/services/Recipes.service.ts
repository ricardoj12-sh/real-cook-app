import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Category, Meal } from '../interfaces/recipes.interface';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private _recipes = new BehaviorSubject<Meal[]>([]);
  public recipes$ = this._recipes.asObservable();
  private newRecipeSubject = new BehaviorSubject<Meal | null>(null);
  public newRecipe$ = this.newRecipeSubject.asObservable();
  private cacheCategories: Category[] = [];

  private _totalPages = 0;
  private _totalProducts = 0;

  public currentPage = 1; // Página actual
  public pageSize = 10; // Tamaño de página

  constructor(private http: HttpClient) {}

  /** Cargar recetas paginadas del backend */
  loadRecipesPaginated(start: number, end: number): void {
    this.http
      .get<Meal[]>(`${environment.apiBackendUrl}/recipes?_start=${start}&_end=${end}`)
      .subscribe({
        next: (recipes) => {
          this._recipes.next(recipes);
          this.calculateTotalPages(); // Asegura que el total de páginas esté sincronizado
        },
        error: (error) => {
          console.error('Error al obtener recetas paginadas:', error);
        },
      });
  }

  /** Obtener el total de recetas */
  calculateTotalPages(): void {
    this.http
      .get<{ totalRecipes: number }>(`${environment.apiBackendUrl}/recipes/count`)
      .subscribe({
        next: (response) => {
          this._totalProducts = response.totalRecipes;
          this._totalPages = Math.ceil(this._totalProducts / this.pageSize);
        },
        error: (error) => {
          console.error('Error al calcular el total de páginas:', error);
        },
      });
  }

  /** Cambiar página en la paginación */
  onPageChange(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.loadRecipesPaginated(start, end);
  }

  /** Obtener una receta por ID */
  getRecipeById(id: string): Observable<Meal | null> {
    return this.http.get<Meal>(`${environment.apiBackendUrl}/recipes/${id}`).pipe(
      map((recipe) => {
        console.log('Datos recibidos del backend:', recipe); // <-- Agregar esta línea
        return recipe ? recipe : null;
      }),
      catchError((error) => {
        console.error('Error al obtener la receta:', error);
        return of(null);
      })
    );
  }
  
  /** Agregar una nueva receta */
  addRecipe(recipe: Meal): Observable<Meal> {
    return this.http.post<Meal>(`${environment.apiBackendUrl}/recipes`, recipe).pipe(
      map((response) => {
        this.addRecipeLocally(response);
        return response;
      }),
      catchError((error) => {
        console.error('Error al agregar la receta:', error);
        return of(null as any);
      })
    );
  }

  /** Agregar receta localmente */
  private addRecipeLocally(recipe: Meal): void {
    const currentRecipes = this._recipes.getValue();
    if (!currentRecipes.some((r) => r.idMeal === recipe.idMeal)) {
      this._recipes.next([recipe, ...currentRecipes]);
    }
  }

  /** Buscar recetas por nombre */
  searchRecipesByDishName(name: string): void {
    this.http
      .get<Meal[]>(`${environment.apiBackendUrl}/search?name=${name}`)
      .subscribe({
        next: (recipes) => {
          this._recipes.next(recipes);
        },
        error: (error) => {
          console.error('Error al buscar recetas por nombre:', error);
        },
      });
  }

  /** Buscar recetas por categoría */
  searchRecipesByCategories(category: string): void {
    this.http
      .get<Meal[]>(`${environment.apiBackendUrl}/category/${category}`)
      .subscribe({
        next: (recipes) => {
          this._recipes.next(recipes);
        },
        error: (error) => {
          console.error('Error al buscar por categoría:', error);
        },
      });
  }

  /** Buscar recetas por país */
  searchRecipesByCountry(country: string): void {
    this.http
      .get<Meal[]>(`${environment.apiBackendUrl}/country/${country}`)
      .subscribe({
        next: (recipes) => {
          this._recipes.next(recipes);
        },
        error: (error) => {
          console.error('Error al buscar por país:', error);
        },
      });
  }

  /** Obtener categorías */
  getCategories() {
    if (this.cacheCategories.length !== 0) {
      return of(this.cacheCategories);
    }
    return this.http
      .get<Category[]>(`${environment.apiBackendUrl}/categories`)
      .pipe(
        map((categories) => {
          this.cacheCategories = categories;
          return categories;
        }),
        catchError((error) => {
          console.error('Error al obtener categorías:', error);
          return of([]);
        })
      );
  }

  /** Obtener total de productos y páginas */
  get totalPage(): number {
    return this._totalPages;
  }

  get totalProducts(): number {
    return this._totalProducts;
  }
}

import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';
import { Meal } from '../../recipes/interfaces/recipes.interface';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favorites: Meal[] = [];
  selectedRecipe: Meal | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalFavorites: number = 0;
  totalPages: number = 0;

  private navigationSubscription!: Subscription;

  constructor(private favoritesService: FavoritesService, private router: Router) {}

  ngOnInit(): void {
    this.loadFavoritesPaginated();

    // Detectar cuando el usuario usa el botón de retroceso
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Si se navega hacia atrás, limpia el contenido de la receta seleccionada
        if (this.selectedRecipe) {
          this.selectedRecipe = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  loadFavoritesPaginated(page: number = 1): void {
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.favoritesService.getFavoritesPaginated(start, end).subscribe({
      next: (data) => {
        this.favorites = data.favorites;
        this.totalFavorites = data.total;
        this.pageSize = data.pageSize;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      },
      error: (err) => console.error('Error al cargar favoritos paginados:', err),
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadFavoritesPaginated(page);
  }

  loadRecipeDetails(idMeal: string | undefined): void {
    if (!idMeal) {
      console.error('El ID de la receta es inválido.');
      return;
    }

    const selected = this.favorites.find((fav) => fav.idMeal === idMeal);
    if (selected) {
      this.selectedRecipe = selected;
    }
  }

  trackByFavoriteId(index: number, recipe: Meal): string {
    return recipe.idMeal || `${index}`;
  }
}

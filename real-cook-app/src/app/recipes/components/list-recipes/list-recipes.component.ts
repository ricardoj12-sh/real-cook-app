import { Component, HostListener, OnInit } from '@angular/core';
import { RecipesService } from '../../services/Recipes.service';
import { Meal } from '../../interfaces/recipes.interface';

@Component({
  selector: 'app-list-recipes',
  templateUrl: './list-recipes.component.html',
  styleUrls: ['./list-recipes.component.css'],
})
export class ListRecipesComponent implements OnInit {
  recipes: Meal[] = [];
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  pageSize: number = 10; // Tamaño de página inicial

  constructor(private serviceRecipes: RecipesService) {}

  ngOnInit(): void {
    // Cargar la primera página al iniciar
    this.loadPage(1);

    // Suscribirse al observable de recetas para actualizar la lista en tiempo real
    this.serviceRecipes.recipes$.subscribe((recipes) => {
      this.recipes = recipes;
    });

    // Actualizar el total de páginas al inicializar el componente
    this.totalPages = this.serviceRecipes.totalPage;
  }

  /** Cargar recetas para una página específica */
  loadPage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.serviceRecipes.loadRecipesPaginated(start, end);
  }

  /** Cambiar de página */
  onPageChange(page: number): void {
    this.loadPage(page);
  }

  /** Ajustar el tamaño de página dinámicamente según el ancho de la ventana */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updatePageSize();
  }

  /** Actualizar el tamaño de página según el ancho de la ventana */
  private updatePageSize(): void {
    const width = window.innerWidth;

    if (width >= 1100) {
      this.pageSize = 10;
    } else if (width >= 864) {
      this.pageSize = 8;
    } else if (width >= 564) {
      this.pageSize = 6;
    } else {
      this.pageSize = 3;
    }

    // Recargar recetas con el nuevo tamaño de página
    this.loadPage(this.currentPage);
  }

  /** Función para rastrear elementos de la lista por ID */
  trackCardById(index: number, recipe: Meal): string {
    return recipe.idMeal || `${index}`; // Devuelve el ID de la receta o el índice como fallback
  }
}

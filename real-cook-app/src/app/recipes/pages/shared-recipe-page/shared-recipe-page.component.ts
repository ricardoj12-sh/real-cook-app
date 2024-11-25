import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-shared-recipe-page',
  templateUrl: './shared-recipe-page.component.html',
  styleUrls: ['./shared-recipe-page.component.css'],
})
export class SharedRecipePageComponent implements OnInit {
  recipe: any = null;
  ingredientsWithMeasures: { ingredient: string; measure: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la ruta
    this.route.params.subscribe((params) => {
      const id = params['id'];
      console.log('ID recibido:', id); // Verifica que el ID sea correcto
      if (id) {
        this.loadSharedRecipe(id);
      }
    });
  }

  loadSharedRecipe(id: string): void {
    this.backendService.getSharedRecipeById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.setupIngredients();
      },
      error: (err) => {
        console.error('Error al cargar la receta compartida:', err);
        alert('No se pudo cargar la receta. Intenta nuevamente.');
      },
    });
  }

  setupIngredients(): void {
    this.ingredientsWithMeasures = [];
    if (this.recipe && this.recipe.ingredients && this.recipe.measures) {
      for (let i = 0; i < this.recipe.ingredients.length; i++) {
        const ingredient = this.recipe.ingredients[i];
        const measure = this.recipe.measures[i];
        if (ingredient && measure) {
          this.ingredientsWithMeasures.push({ ingredient, measure });
        }
      }
    }
  }
}

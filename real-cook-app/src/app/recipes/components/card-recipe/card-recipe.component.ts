import { Component, Input } from '@angular/core';
import { Meal } from '../../interfaces/recipes.interface';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-card-recipe',
  templateUrl: './card-recipe.component.html',
  styleUrls: ['./card-recipe.component.css'],
})
export class CardRecipeComponent {
  imagenLoading: boolean = false;
  @Input() meal!: Meal;

  constructor(private backendService: BackendService) {}

  onImagenLoad(): void {
    this.imagenLoading = true;
  }

  shareRecipe(): void {
    // Genera un enlace que apunta al frontend
    const link = `${window.location.origin}/shared/${this.meal.idMeal}`;
    
    navigator.clipboard.writeText(link).then(() => {
      alert('¡Enlace copiado al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar el enlace:', err);
      alert('No se pudo copiar el enlace.');
    });
  }
  
  
}

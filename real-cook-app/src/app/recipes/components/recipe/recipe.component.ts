import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../services/Recipes.service';
import { Meal } from '../../interfaces/recipes.interface';
import { CommentService } from '../../../comment.service';
import { Comment } from '../../interfaces/comment.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { FavoritesService } from '../../../services/favorites.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  @Input() recipeId: string | null = null; // Recibe ID de receta desde favoritos (Input opcional)
  @Input() isFavoriteView: boolean = false; // Indica si se muestra desde favoritos
  recipe: Meal | null = null;
  ingredientsWithMeasures: { ingredient: string; measure: string }[] = [];
  comments: Comment[] = [];
  newComment: Comment = { recipeId: '', user: '', content: '' };
  user: string = ''; // Campo para capturar el usuario

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private commentService: CommentService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    console.log('isFavoriteView:', this.isFavoriteView); // Validar si se recibe correctamente
    const id = this.recipeId ?? this.route.snapshot.params['id'];
    if (id) {
      this.getRecipeDetails(id);
      this.loadComments(id);
    } else {
      console.error('El ID de la receta es inválido.');
      this.router.navigate(['/']);
    }
  }
  

  getRecipeDetails(id: string) {
    this.recipesService.getRecipeById(id).subscribe({
      next: (recipe) => {
        console.log('Receta asignada:', recipe);
        if (recipe) {
          this.recipe = recipe;
          this.setupIngredients();
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error al obtener la receta:', error);
        this.router.navigate(['/']);
      },
    });
  }

  setupIngredients() {
    this.ingredientsWithMeasures = [];
    if (this.recipe) {
      for (let i = 1; i <= 20; i++) {
        const ingredientKey = `strIngredient${i}` as keyof Meal;
        const measureKey = `strMeasure${i}` as keyof Meal;

        const ingredient = this.recipe[ingredientKey]?.trim();
        const measure = this.recipe[measureKey]?.trim();

        if (ingredient && ingredient !== 'null') {
          this.ingredientsWithMeasures.push({
            ingredient,
            measure: measure || 'sin medida',
          });
        }
      }
      console.log('Ingredientes procesados:', this.ingredientsWithMeasures);
    }
  }

  loadComments(recipeId: string) {
    this.commentService.getCommentsByRecipe(recipeId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
      },
    });
  }

  submitComment() {
    if (this.recipe && this.recipe.idMeal) {
      this.newComment.recipeId = this.recipe.idMeal;
      this.commentService.createComment(this.newComment).subscribe({
        next: (comment) => {
          this.comments.push(comment);
          this.newComment = { recipeId: '', user: '', content: '' };
        },
        error: (error) => {
          console.error('Error al enviar comentario:', error);
        },
      });
    } else {
      console.error('El ID de la receta no está definido. No se puede enviar el comentario.');
    }
  }

  addToFavorites() {
    if (this.isFavoriteView) {
      console.warn('Esta receta ya está en favoritos.');
      return;
    }

    if (!this.user.trim()) {
      alert('Por favor, ingresa tu nombre antes de agregar a favoritos.');
      return;
    }

    if (this.recipe && this.recipe.idMeal) {
      this.favoritesService.addFavorite(this.user, +this.recipe.idMeal).subscribe({
        next: () => {
          alert('¡Receta agregada a favoritos con éxito!');
        },
        error: (err) => {
          console.error('Error al agregar a favoritos:', err);
          alert('Hubo un error al agregar la receta a favoritos.');
        },
      });
    }
  }
}

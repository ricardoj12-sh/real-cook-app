import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../services/Recipes.service';
import { Category, Meal } from '../../interfaces/recipes.interface';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit {
  staticCategories: Category[] = [
    { idCategory: '1', strCategory: 'Beef', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '2', strCategory: 'Chicken', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '3', strCategory: 'Dessert', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '4', strCategory: 'Pasta', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '5', strCategory: 'Seafood', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '6', strCategory: 'Vegetarian', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '7', strCategory: 'Breakfast', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '8', strCategory: 'Salad', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '9', strCategory: 'Side Dish', strCategoryThumb: '', strCategoryDescription: '' },
    { idCategory: '10', strCategory: 'Snack', strCategoryThumb: '', strCategoryDescription: '' }
  ];

  categories: Category[] = [];
  recipes: Meal[] = [];

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    // Cargar categorías desde el servicio o usar la lista estática
    this.recipeService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.length > 0 ? categories : this.staticCategories;
      },
      error: () => {
        this.categories = this.staticCategories;
      }
    });

    // Cargar todas las recetas al iniciar y suscribirse una sola vez a recipes$
    this.loadAllRecipes();

    // Suscribirse a nuevas recetas para actualizar la lista en tiempo real
    this.recipeService.newRecipe$.subscribe({
      next: (newRecipe) => {
        if (newRecipe && !this.recipes.some(r => r.idMeal === newRecipe.idMeal)) {
          this.recipes.unshift(newRecipe);
        }
      },
    });
  }

  loadAllRecipes() {
    this.recipeService.loadRecipesPaginated(0, this.recipeService.pageSize);
    this.recipeService.recipes$.subscribe((recipes: Meal[]) => {
      this.recipes = recipes;
    });
  }

  searchRecipeByCategory(event: Event) {
    const category = (<HTMLInputElement>event.target).value;
    if (category === '' || category === 'Todas las categorias') {
      this.loadAllRecipes();
    } else {
      this.recipeService.searchRecipesByCategories(category);
    }
  }

  searchRecipe(event: any) {
    const name = event.target.value;
    if (name) {
      this.recipeService.searchRecipesByDishName(name);
    } else {
      this.loadAllRecipes();
    }
  }
  onPageChange(page: number): void {
    this.recipeService.onPageChange(page); // Cambia la página en el servicio
    this.recipeService.recipes$.subscribe((recipes: Meal[]) => {
      this.recipes = recipes; // Actualiza las recetas en la página
    });
  }
  
  
}

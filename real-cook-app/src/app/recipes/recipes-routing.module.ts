import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { PageRecipeComponent } from './pages/page-recipe/page-recipe.component';
import { SharedRecipePageComponent } from './pages/shared-recipe-page/shared-recipe-page.component';

const routes: Routes = [
  {
    path: '',
    component: PageHomeComponent,
  },
  {
    path: 'shared/:id',
    component: SharedRecipePageComponent,
  },
  {
    path: ':id',
    component: PageRecipeComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}

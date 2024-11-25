import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RecipesRoutingModule } from './recipes/recipes-routing.module';
import { ListRecipesComponent } from './recipes/components/list-recipes/list-recipes.component';
import { CardRecipeComponent } from './recipes/components/card-recipe/card-recipe.component';
import { FormRecipeComponent } from './recipes/components/form-recipe/form-recipe.component';
import { PageHomeComponent } from './recipes/pages/page-home/page-home.component';
import { PageRecipeComponent } from './recipes/pages/page-recipe/page-recipe.component';
import { HeaderComponent } from './shared/header/header.component';
import { PaginationComponent } from './recipes/components/pagination/pagination.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RecipeComponent } from './recipes/components/recipe/recipe.component';
import { FormsModule } from '@angular/forms';
import { BackendService } from './recipes/services/backend.service';
import { CommentsComponent } from './comment/comment.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { FavoritesService } from './services/favorites.service';
import { SharedRecipePageComponent } from './recipes/pages/shared-recipe-page/shared-recipe-page.component';


registerLocaleData(en);


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ListRecipesComponent,
    CardRecipeComponent,
    FormRecipeComponent,
    PageHomeComponent,
    PageRecipeComponent,
    HeaderComponent,
    PaginationComponent,
    FooterComponent,
    RecipeComponent,
    CommentsComponent,
    FavoritesComponent,
    SharedRecipePageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RecipesRoutingModule,
    FormsModule,
    RouterModule,
    NzTabsModule,
    BrowserAnimationsModule,
  ],
  providers: [BackendService, FavoritesService, { provide: NZ_I18N, useValue: en_US }], // Agregado aquí
  bootstrap: [AppComponent],
})
export class AppModule {}

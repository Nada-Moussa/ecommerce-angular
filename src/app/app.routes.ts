import { Routes } from '@angular/router';
import { SignupComponent } from './core/pages/signup/signup.component';
import { SigninComponent } from '../app/core/pages/signin/signin.component';


export const routes: Routes = [
    {
       path: '',
       redirectTo: 'home',
       pathMatch: 'full'
    },
    {
        path: 'home', loadComponent:()=>import('../app/features/pages/home/home.component').then(c=>c.HomeComponent)
    },
    {
        path: 'signup', loadComponent:()=>import('../app/core/pages/signup/signup.component').then(c=>SignupComponent)
    },
    {
        path: 'signin', loadComponent:()=>import('../app/core/pages/signin/signin.component').then(c=>SigninComponent)
    },
    {
        path: 'signin/forgotpass', loadComponent:()=>import('../app/core/pages/forgotpass/forgotpass.component').then(c=>c.ForgotpassComponent)
    },
    {
        path: 'signin/verifyresetcode', loadComponent:()=>import('../app/core/pages/verifyresetcode/verifyresetcode.component').then(c=>c.VerifyresetcodeComponent)
    },
    {
        path: 'signin/newpass', loadComponent:()=>import('../app/core/pages/newpass/newpass.component').then(c=> c.NewpassComponent)
    },
    {
        path: 'profile/resetpass', loadComponent:()=>import('../app/core/pages/resetpass/resetpass.component').then(c=>c.ResetpassComponent)
    },
    {
        path: 'products', loadComponent:()=>import('../app/features/pages/products/products.component').then(c=>c.ProductsComponent)
    },
    {
        path: 'products/product_details/:id', loadComponent:()=>import('../app/features/pages/productdetails/productdetails.component').then(c=>c.ProductdetailsComponent)
    },
    {
        path: 'products/subcategories/:id/:name', loadComponent: () =>import('../app/features/pages/subcatproducts/subcatproducts.component').then(c => c.SubcatproductsComponent)
    },
    {
        path: 'products/brands/:id/:name', loadComponent: () =>import('../app/features/pages/brandproducts/brandproducts.component').then(c => c.BrandproductsComponent)
    },
    {
        path: 'categories', loadComponent:()=>import('../app/features/pages/categories/categories.component').then(c=>c.CategoriesComponent)
    },
    {
        path: 'categories/subcategories/:id/:name', loadComponent: () =>import('../app/features/pages/subcategories/subcategories.component').then(c => c.SubcategoriesComponent)
    },
    {
        path: 'brands', loadComponent:()=>import('../app/features/pages/brands/brands.component').then(c=>c.BrandsComponent)
    },
    {
        path: 'allorders', loadComponent:()=>import('../app/features/pages/orders/orders.component').then(c=>c.OrdersComponent)
    },
    {
        path: 'cart', loadComponent:()=>import('../app/features/pages/cart/cart.component').then(c=>c.CartComponent)
    },
    {
        path: 'cart/checkout', loadComponent:()=>import('../app/features/pages/checkout/checkout.component').then(c=>c.CheckoutComponent)
    },
    {
        path: 'wishlist', loadComponent:()=>import('../app/features/pages/wishlist/wishlist.component').then(c=>c.WishlistComponent)
    },
    {
        path: 'profile', loadComponent:()=>import('../app/features/pages/profile/profile.component').then(c=>c.ProfileComponent)
    },
    {
        path: '**', loadComponent:()=>import('../app/core/pages/notfound/notfound.component').then(c=>c.NotfoundComponent)
    },
];

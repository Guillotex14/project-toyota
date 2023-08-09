import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'mechanic',
    loadChildren: () => import('./home-mechanic/home-mechanic.module').then( m => m.HomeMechanicPageModule)
  },
  {
    path: 'inspections',
    loadChildren: () => import('./inspections/inspections.module').then( m => m.InspectionsPageModule)
  },
  {
    path: 'mechanical-file/:id',
    loadChildren: () => import('./mechanical-file/mechanical-file.module').then( m => m.MechanicalFilePageModule)
  },
  {
    path: 'car-detail/:id/:route',
    loadChildren: () => import('./car-detail/car-detail.module').then( m => m.CarDetailPageModule)
  },
  {
    path: 'car-detail/:id/:route/:category',
    loadChildren: () => import('./car-detail/car-detail.module').then( m => m.CarDetailPageModule)
  },
  {
    path: 'car-detail-mechanic/:id/:route',
    loadChildren: () => import('./car-detail-mechanic/car-detail-mechanic.module').then( m => m.CarDetailMechanicPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'create-user-admin',
    loadChildren: () => import('./create-user-admin/create-user-admin.module').then( m => m.CreateUserAdminPageModule)
  },
  {
    path: 'list-user-admin',
    loadChildren: () => import('./list-user-admin/list-user-admin.module').then( m => m.ListUserAdminPageModule)
  },
  {
    path: 'edit-user-admi/:id',
    loadChildren: () => import('./edit-user-admin/edit-user-admin.module').then( m => m.EditUserAdminPageModule)
  },
  {
    path: 'sells-history',
    loadChildren: () => import('./sells-history/sells-history.module').then( m => m.SellsHistoryPageModule)
  },
  {
    path: 'seller',
    loadChildren: () => import('./home-seller/home-seller.module').then( m => m.HomeSellerPageModule)
  },
  {
    path: 'graphics',
    loadChildren: () => import('./graphics/graphics.module').then( m => m.GraphicsPageModule)
  },
  {
    path: 'add-vehicle',
    loadChildren: () => import('./add-vehicle/add-vehicle.module').then( m => m.AddVehiclePageModule)
  },
  {
    path: 'how-much-vehicle',
    loadChildren: () => import('./how-muhc-vehicle/how-muhc-vehicle.module').then( m => m.HowMuhcVehiclePageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'add-mechanic',
    loadChildren: () => import('./add-mechanic/add-mechanic.module').then( m => m.AddMechanicPageModule)
  },
  {
    path: 'graphics-admin',
    loadChildren: () => import('./graphics-admin/graphics-admin.module').then( m => m.GraphicsAdminPageModule)
  },
  {
    path: 'buy-car',
    loadChildren: () => import('./buy-car/buy-car.module').then( m => m.BuyCarPageModule)
  },
  {
    path: 'mechanical-file-detail/:id/:route',
    loadChildren: () => import('./mechanical-file-detail/mechanical-file-detail.module').then( m => m.MechanicalFileDetailPageModule)
  },
  {
    path: 'my-vehicles',
    loadChildren: () => import('./myvehicles/myvehicles.module').then( m => m.MyvehiclesPageModule)
  },
  {
    path: 'add-mechanic-file/:id/:route',
    loadChildren: () => import('./add-mechanic-file/add-mechanic-file.module').then( m => m.AddMechanicFilePageModule)
  },
  {
    path: 'mechanical-file-detail-mechanic/:id/:route',
    loadChildren: () => import('./mechanical-file-detail-mechanic/mechanical-file-detail-mechanic.module').then( m => m.MechanicalFileDetailMechanicPageModule)
  },
  {
    path: 'car-detail-admin/:id/:route',
    loadChildren: () => import('./car-detail-admin/car-detail-admin.module').then( m => m.CarDetailAdminPageModule)
  },
  {
    path: 'mechanical-file-detail-admin/:id/:route',
    loadChildren: () => import('./mechanical-file-detail-admin/mechanical-file-detail-admin.module').then( m => m.MechanicalFileDetailAdminPageModule)
  },
  {
    path: 'add-brand',
    loadChildren: () => import('./add-brand/add-brand.module').then( m => m.AddBrandPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'detail-notification',
    loadChildren: () => import('./detail-notification/detail-notification.module').then( m => m.DetailNotificationPageModule)
  },
  {
    path: 'add-model-vehicle',
    loadChildren: () => import('./add-model-vehicle/add-model-vehicle.module').then( m => m.AddModelVehiclePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

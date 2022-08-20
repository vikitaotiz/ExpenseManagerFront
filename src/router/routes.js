// import CategoryList from "pages/categories/index.js"

import Home from "pages/IndexPage.vue";
import Register from "pages/Register.vue";
import Dashboard from "pages/dashboard/index.vue";
import Categories from "pages/categories/index.vue";
import CategoryProducts from "pages/products/CategoryProducts.vue";
import CompanyEntries from "pages/entries/CompanyEntries.vue";
import CompanyStores from "pages/company_stores/Index.vue";
import AllProducts from "pages/products/index.vue";
import Costings from "pages/costings/Index.vue";
import CostingCategoryProducts from "pages/costings/CostingCategoryProducts.vue";
import Entries from "pages/entries/Index.vue";
import AllEntries from "pages/entries/AllEntries.vue";
import TodayEntries from "pages/entries/TodayEntries.vue";
import Settings from "pages/settings/Index.vue";
import Roles from "pages/roles/Index.vue";
import Users from "pages/users/Index.vue";
import Companies from "pages/companies/Index.vue";
import Reports from "pages/reports/Index.vue";
import EntriesReports from "pages/reports/EntriesReports.vue";
import Parts from "pages/parts/Index.vue";
import Units from "pages/units/Index.vue";
import Spilages from "pages/spilages/Index.vue";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: Home,
        name: "Login",
      },
      { path: "/register", component: Register },
      {
        path: "/dashboard",
        component: Dashboard,
      },
      {
        path: "/categories",
        component: Categories,
      },
      {
        path: "/category_products/:slug",
        component: CategoryProducts,
      },
      {
        path: "/company_entries/:slug",
        component: CompanyEntries,
      },
      {
        path: "/costing_category_products/:slug",
        component: CostingCategoryProducts,
      },
      {
        path: "/all_products",
        component: AllProducts,
      },
      {
        path: "/costings",
        component: Costings,
      },
      {
        path: "/entries",
        component: Entries,
      },
      {
        path: "/today_entries",
        component: TodayEntries,
      },
      {
        path: "/all_entries",
        component: AllEntries,
      },
      {
        path: "/settings",
        component: Settings,
      },
      {
        path: "/roles",
        component: Roles,
      },
      {
        path: "/users",
        component: Users,
      },
      {
        path: "/companies",
        component: Companies,
      },
      {
        path: "/reports",
        component: Reports,
      },
      {
        path: "/parts",
        component: Parts,
      },
      {
        path: "/units",
        component: Units,
      },
      {
        path: "/company_stores",
        component: CompanyStores,
      },

      {
        path: "/entries_reports",
        component: EntriesReports,
      },
      {
        path: "/spilages",
        component: Spilages,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

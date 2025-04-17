import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/storesystem',
    name: 'StoreSystem',
    component: () => import('@/views/StoreSystem.vue')
  },
  {
    path: '/introduce',
    name: 'Introduce',
    component: () => import('@/views/Introduce.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue')
  },
  {
    path: '/detail/:id',
    name: 'Details',
    component: () => import('@/views/DetailsProduct.vue'),
    prop: (route) => ({ bookId: route.params.id })
  },
  {
    path: '/findProduct/:name',
    name: 'FindProduct',
    component: () => import('@/views/FindProduct.vue'),
    prop: (route) => ({ name: route.params.name })
  },
  {
    path: '/categoryBook/:name',
    name: 'CategoryBook',
    component: () => import('@/views/CategoryBook.vue'),
    prop: (route) => ({ theLoai: route.params.name })
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/admin',
    name: 'HomeAdmin',
    component: () => import('@/views/HomeAdmin.vue'),
    meta: { requireLogin: true, requireAdmin: true }
  },
  {
    path: '/admin/ManageBooks',
    name: 'ManageBooks',
    component: () => import('@/views/ManageBooks.vue'),
    meta: { requireLogin: true, requireAdmin: true }
  },
  {
    path: '/admin/ManageOrders',
    name: 'ManageOrders',
    component: () => import('@/views/ManageOrders.vue'),
    meta: { requireLogin: true, requireAdmin: true }
  },
  {
    path: "/editBook/:id",
    name: "EditBook",
    component: () => import("@/views/EditBook.vue"),
    meta: { requireLogin: true, requireAdmin: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue'),
    meta: { requireLogin: true, requireUser: true }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order.vue'),
    meta: { requireLogin: true, requireUser: true }
  },
  {
    path: '/order_complete/:id',
    name: 'OrderComplete',
    component: () => import('@/views/OrderComplete.vue'),
    prop: (route) => ({ cartId: route.params.id }),
    meta: { requireLogin: true, requireUser: true }
  },
  {
    path: '/infoUser/:id',
    name: 'infoUser',
    component: () => import('@/views/InfoUser.vue'),
    prop: (route) => ({ userId: route.params.id }),
    meta: { requireLogin: true, requireUser: true }
  },
  {
    path: '/detailorder/:id',
    name: 'DetailOrder',
    component: () => import('@/views/DetailOrder.vue'),
    prop: (route) => ({ cartId: route.params.id }),
    meta: { requireLogin: true, requireUser: true }
  },
  {
    path: "/changepassword/:id",
    name: "ChangePassword",
    component: () => import("@/views/changePassword.vue"),
    meta: { requireLogin: true, requireUser: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top
    return { top: 0 };
  }
});
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // Check if route requires login
  if (to.meta.requireLogin && !userStore.isLoggedIn) {
    alert('Bạn cần phải đăng nhập để truy cập trang này!');
    next('/login');
  }
  // Check if route requires admin access
  else if (to.meta.requireAdmin && !userStore.isAdmin) {
    alert('Bạn không có quyền truy cập trang này!');
    next('/');
  } else if (to.meta.requireUser && userStore.isAdmin) {
    alert('Bạn không có quyền truy cập trang này!');
    next('/admin');
  } else {
    next();
  }
});
export default router;

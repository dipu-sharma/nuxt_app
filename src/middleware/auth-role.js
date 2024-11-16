import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (import.meta.server) return;

  // Check Authentication
  authStore.checkAuth();
  if (!authStore.isAuthenticated) {
    authStore.$ResetAuth();
    return navigateTo("/login");
  }

  // Ensure roles are an array
  const userRoles = Array.isArray(authStore.roles)
    ? authStore.roles
    : [authStore.roles];

  // Admin can access all pages
  if (userRoles.includes("admin")) {
    return;
  }

  // Define roles and routes mapping
  const rolesRoutes = {
    superadmin: "/superadmin",
    vendor: "/vendor",
    user: "/user",
  };

  // Check roles and navigate to specific routes
  const userRole = userRoles.find((role) => rolesRoutes[role]);

  if (userRole) {
    const specificRoute = rolesRoutes[userRole];
    if (to.path !== specificRoute) {
      return navigateTo(specificRoute);
    }
  } else {
    return navigateTo("/not-authorized");
  }
});

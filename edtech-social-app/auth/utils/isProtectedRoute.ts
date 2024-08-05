export const protectedRoutes = ["/", "/friends", "/notifications", "/chat"]

export const isProtectedRoute = (path: string): boolean => {
  return protectedRoutes.includes(path)
}

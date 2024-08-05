// edtech-social-app/auth/utils/validateURL.ts

export const isValidVideoUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}

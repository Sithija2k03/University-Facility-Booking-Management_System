export function getAuthConfig(credentials, buildBasicAuthHeader) {
  if (credentials?.email && credentials?.password) {
    return {
      headers: {
        Authorization: buildBasicAuthHeader(credentials.email, credentials.password),
      },
      withCredentials: true,
    };
  }
  return { withCredentials: true };
}
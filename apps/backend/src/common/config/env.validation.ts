type EnvKey = "DATABASE_URL" | "JWT_SECRET" | "JWT_EXPIRES_IN";

export function validateEnv(): void {
  const requiredEnvVars: EnvKey[] = [
    "DATABASE_URL",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key] || process.env[key]?.trim() === "",
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`,
    );
  }
}
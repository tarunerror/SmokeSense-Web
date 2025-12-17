/**
 * Environment variable validation
 * Ensures required environment variables are present at runtime
 */

function getEnvVar(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env or .env.local file and ensure all required variables are set.\n` +
      `Make sure there are no spaces around the = sign.\n` +
      `See .env.example for reference.`
    );
  }
  
  return value.trim();
}

// Lazy-load environment variables to avoid runtime errors during module evaluation
let _env: {
  supabase: {
    url: string;
    anonKey: string;
  };
} | null = null;

export const env = {
  get supabase() {
    if (!_env) {
      _env = {
        supabase: {
          url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
          anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        },
      };
    }
    return _env.supabase;
  },
};

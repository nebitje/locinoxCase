interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  /** Optioneel: vast publiek adres waarmee gedeeld wordt, bv. https://locinox-case.vercel.app */
  readonly VITE_PUBLIC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

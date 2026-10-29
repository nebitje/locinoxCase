// Maakt de testaccounts aan (idempotent). Gebruik: npm run seed
// Leest .env via `node --env-file=.env`; wachtwoorden komen nooit uit de code.
import { createClient } from '@supabase/supabase-js'

type Role = 'admin' | 'employee'

interface SeedUser {
  email: string
  displayName: string
  role: Role
  language: 'en' | 'fr' | 'de' | 'nl'
  passwordVar: 'SEED_ADMIN_PASSWORD' | 'SEED_EMPLOYEE_PASSWORD'
}

const users: SeedUser[] = [
  { email: 'admin@example.com', displayName: 'Test Admin', role: 'admin', language: 'en', passwordVar: 'SEED_ADMIN_PASSWORD' },
  { email: 'employee.en@example.com', displayName: 'Test Employee EN', role: 'employee', language: 'en', passwordVar: 'SEED_EMPLOYEE_PASSWORD' },
  { email: 'employee.fr@example.com', displayName: 'Test Employee FR', role: 'employee', language: 'fr', passwordVar: 'SEED_EMPLOYEE_PASSWORD' },
  { email: 'employee.de@example.com', displayName: 'Test Employee DE', role: 'employee', language: 'de', passwordVar: 'SEED_EMPLOYEE_PASSWORD' },
]

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Ontbrekende omgevingsvariabele: ${name}`)
  return value
}

const supabase = createClient(requireEnv('VITE_SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function findUserId(email: string): Promise<string | undefined> {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 })
  if (error) throw error
  return data.users.find((user) => user.email === email)?.id
}

for (const user of users) {
  const password = requireEnv(user.passwordVar)
  let id = await findUserId(user.email)

  if (id) {
    const { error } = await supabase.auth.admin.updateUserById(id, { password, email_confirm: true })
    if (error) throw error
  } else {
    const { data, error } = await supabase.auth.admin.createUser({ email: user.email, password, email_confirm: true })
    if (error) throw error
    id = data.user.id
  }

  const { error } = await supabase.from('profiles').upsert({
    id,
    display_name: user.displayName,
    role: user.role,
    preferred_language: user.language,
  })
  if (error) throw error

  console.log(`ok: ${user.email} (${user.role}, ${user.language})`)
}

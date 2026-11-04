import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SairButton from './sair-button'

export const dynamic = 'force-dynamic'

export default async function PainelPage() {
  const supabase = await createClient()

  // Verifica se o usuário está autenticado
  const { data: auth, error: authError } =
    await supabase.auth.getClaims()

  if (authError || !auth?.claims?.sub) {
    redirect('/login')
  }

  const userId = auth.claims.sub

  // Busca o vínculo do usuário com uma empresa
  const { data: vinculo, error: vinculoError } =
    await supabase
      .from('memberships')
      .select('business_id, role')
      .eq('user_id', userId)
      .eq('role', 'owner')
      .limit(1)
      .maybeSingle()

  if (vinculoError) {
    return <main>Erro: {vinculoError.message}</main>
  }

  if (!vinculo) {
    return (
      <main style={{ padding: 40 }}>
        <h1>AutoAgenda</h1>
        <p>Você ainda não possui um estabelecimento.</p>
        <a href="/estabelecimento/novo">
          Cadastrar estabelecimento
        </a>
      </main>
    )
  }

  // Busca os dados da empresa, respeitando a RLS
  const { data: empresa, error: empresaError } =
    await supabase
      .from('businesses')
      .select('name, slug, category')
      .eq('id', vinculo.business_id)
      .single()

  if (empresaError || !empresa) {
    return (
      <main style={{ padding: 40 }}>
        <p>Não foi possível carregar o estabelecimento.</p>
      </main>
    )
  }

  return (
    <main style={{
      maxWidth: 900,
      margin: '50px auto',
      padding: 30,
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🚗 AutoAgenda</h1>

      <SairButton />

      <h2>Bem-vindo ao seu painel!</h2>

      <p>
        <strong>Estabelecimento:</strong> {empresa.name}
      </p>

      <p>
        <strong>Identificador:</strong> {empresa.slug}
      </p>

      <p>
        <strong>Categoria:</strong> {empresa.category}
      </p>

      <p>
        <strong>Sua função:</strong> {vinculo.role}
      </p>

      <hr />

      <h3>Gerenciamento</h3>
      <p>✅ Usuário autenticado</p>
      <p>✅ Estabelecimento identificado</p>
      <p>✅ Dados consultados no Supabase</p>

      <p>
        Em breve, sua agenda real aparecerá aqui.
      </p>
    </main>
  )
}

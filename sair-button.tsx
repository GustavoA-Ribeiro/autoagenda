
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SairButton() {
  const [saindo, setSaindo] = useState(false)
  const [erro, setErro] = useState('')

  async function sair() {
    setSaindo(true)
    setErro('')

    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      setErro('Erro ao sair: ' + error.message)
      setSaindo(false)
      return
    }

    window.location.replace('/login')
  }

  return (
    <div>
      <button
        type="button"
        onClick={sair}
        disabled={saindo}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {saindo ? 'Saindo...' : 'Sair da conta'}
      </button>

      {erro && <p role="alert">{erro}</p>}
    </div>
  )
}

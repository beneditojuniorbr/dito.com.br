import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

serve(async (req) => {
  try {
    const url = new URL(req.url)
    let body = {}
    
    // Tenta ler o body JSON (Webhooks enviam como POST JSON)
    if (req.method === 'POST') {
      try {
        body = await req.json()
      } catch (e) {
        console.log("Sem JSON body")
      }
    }

    const topic = url.searchParams.get("topic") || url.searchParams.get("type") || body?.type || body?.action
    const id = url.searchParams.get("data.id") || url.searchParams.get("id") || body?.data?.id || (body?.action?.includes('payment') ? body.id : null)

    if (!topic || (!topic.includes('payment') && topic !== 'payment.created')) {
      return new Response('Ignorado', { status: 200 })
    }

    if (!id) {
      return new Response('ID do pagamento não encontrado', { status: 400 })
    }

    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')
    
    // Busca os dados reais do pagamento no MP para evitar fraudes
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
    })
    
    if (!paymentRes.ok) {
      throw new Error("Erro ao consultar pagamento no Mercado Pago");
    }
    
    const paymentData = await paymentRes.json()

    if (paymentData.status === 'approved') {
      // Pega o userId, productId e paymentId que enviamos no create-pix
      if (paymentData.external_reference) {
        const { userId, productId, paymentId } = JSON.parse(paymentData.external_reference)

        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Salva a compra no banco de dados para liberar o acesso!
        await supabaseAdmin.from('dito_purchases').insert([
          { user_id: userId, product_id: productId, payment_id: paymentId || id, status: 'approved' }
        ])
        
        // Se houver uma tabela de notificações, também poderíamos avisar por ela aqui
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Erro Interno', { status: 500 })
  }
})

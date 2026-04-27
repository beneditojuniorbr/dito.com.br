import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { productId, amount, email, userId } = await req.json()
    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')
    
    if (!MP_ACCESS_TOKEN) {
      throw new Error("Token do Mercado Pago não configurado no backend.");
    }

    const paymentData = {
      transaction_amount: parseFloat(amount),
      description: `Produto Dito - ${productId}`,
      payment_method_id: 'pix',
      payer: { email: email || 'cliente@dito.com.br' },
      external_reference: JSON.stringify({ userId, productId }) // GUARDA QUEM COMPROU O QUE
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()

    if (!data.point_of_interaction) {
      console.error("Erro MP:", data);
      throw new Error("Não foi possível gerar o Pix no Mercado Pago.");
    }

    return new Response(JSON.stringify({ 
      qr_code: data.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      payment_id: data.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

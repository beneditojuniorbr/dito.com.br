// index.ts (Deno - Supabase Edge Function)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
}

serve(async (req) => {
  // Lida com requisições OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const url = new URL(req.url);
    const bodyStr = await req.text();
    const body = bodyStr ? JSON.parse(bodyStr) : {};
    
    // Detecta ação: via URL (?action=) ou via corpo ou via tópico do MP
    let action = url.searchParams.get('action') || body.action;
    
    // Se o Mercado Pago enviar um webhook padrão, ele manda um "topic" ou "type"
    if (body.topic === 'payment' || body.type === 'payment') {
      action = 'webhook';
    }

    const { amount, description, email, metadata } = body;
    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN');
    console.log(`🚀 [Exec] Açao: ${action} | Metodo: ${req.method}`);

    // 1. GERAÇÃO DE PIX DINÂMICO
    if (action === 'create-pix') {
      console.log(`💰 Criando Pix de R$ ${amount} para ${email}`)
      
      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'X-Idempotency-Key': crypto.randomUUID(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_amount: amount,
          description: description,
          payment_method_id: 'pix',
          payer: { email },
          metadata: metadata,
          notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercado-pago-bridge`
        }),
      })

      const data = await response.json()
      
      if (!data.point_of_interaction) {
        throw new Error(data.message || 'Erro ao gerar Pix no Mercado Pago');
      }

      // 1.5 SALVA O PAGAMENTO NO BANCO DITO (SUPABASE)
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || "";
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";
      
      await fetch(`${supabaseUrl}/rest/v1/dito_payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          id: metadata.payment_id,
          status: 'pending',
          amount: amount,
          description: description,
          username: metadata.username,
          metadata: metadata,
          created_at: new Date().toISOString()
        })
      });

      return new Response(JSON.stringify({
        id: data.id,
        status: data.status,
        qr_code: data.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 2. WEBHOOK OU CHECAGEM MANUAL
    if (action === 'webhook' || action === 'check-status') {
      const bodyData = body.data || body;
      const paymentId = bodyData.id || url.searchParams.get('id') || body.payment_id;
      
      if (!paymentId) {
         return new Response(JSON.stringify({ error: 'ID do pagamento nao encontrado' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
         })
      }
      
      console.log(`🔎 Verificando Pagamento: ${paymentId}`);
      
      const mpResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
      });
      const mpData = await mpResp.json();
      
      if (mpData.status === 'approved') {
        const metadata = mpData.metadata;
        const username = metadata.username;
        const internalPaymentId = metadata.payment_id;
        const product = metadata.product;

        // 1. Atualiza tabelas
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || "";
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";

        await fetch(`${supabaseUrl}/rest/v1/dito_payments?id=eq.${internalPaymentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({ status: 'approved' })
        });

        // 2. Entrega produto (LIBERAÇÃO)
        if (username && product) {
          try {
            console.log(`🎁 Tentando entregar produto para: @${username}`);
            const userResp = await fetch(`${supabaseUrl}/rest/v1/dito_users?username=eq.${username}&select=purchases`, {
              headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
            });
            const userDataArray = await userResp.json().catch(() => []);
            const userData = Array.isArray(userDataArray) ? userDataArray[0] : null;
            
            if (userData) {
              const currentPurchases = userData.purchases || [];
              if (!currentPurchases.find((p: any) => p.id === product.id)) {
                  currentPurchases.unshift({ ...product, purchased_at: Date.now() });
                  await fetch(`${supabaseUrl}/rest/v1/dito_users?username=eq.${username}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey },
                    body: JSON.stringify({ purchases: currentPurchases })
                  });
                  console.log(`✅ Produto "${product.name}" entregue!`);
              }
            }
          } catch (deliveryErr) {
            console.error(`❌ Erro na entrega do produto:`, deliveryErr);
          }
        }

        // 3. ATUALIZA SALDO DO CRIADOR/VENDEDOR (SISTEMA DE CARTEIRA)
        try {
          const seller = product?.seller || 'Ditão';
          console.log(`💰 Tentando creditar saldo para o vendedor: @${seller}`);
          
          const sellerResp = await fetch(`${supabaseUrl}/rest/v1/dito_users?id=eq.${seller}`, {
            headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
          }).catch(() => null);
          
          // Se não achar por ID, tenta por username
          let sellerFinalResp = sellerResp;
          if (!sellerResp || sellerResp.status !== 200) {
             sellerFinalResp = await fetch(`${supabaseUrl}/rest/v1/dito_users?username=eq.${seller}&select=balance`, {
               headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
             });
          }

          const sellerDataArray = await sellerFinalResp?.json().catch(() => []);
          const sellerData = Array.isArray(sellerDataArray) ? sellerDataArray[0] : null;
          
          if (sellerData) {
            const currentBalance = Number(sellerData.balance || 0);
            const saleAmount = Number(mpData.transaction_amount || mpData.transaction_details?.total_paid_amount || 0);
            const newBalance = currentBalance + saleAmount;

            await fetch(`${supabaseUrl}/rest/v1/dito_users?username=eq.${seller}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey },
              body: JSON.stringify({ balance: newBalance })
            });
            console.log(`✅ Saldo do vendedor @${seller} atualizado: R$ ${newBalance}`);
          }
        } catch (balanceErr) {
          console.error(`❌ Erro ao atualizar saldo:`, balanceErr);
        }
        
        return new Response(JSON.stringify({ status: 'approved', metadata: metadata }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      return new Response(JSON.stringify({ status: mpData.status || 'pending', ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Ação inválida' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

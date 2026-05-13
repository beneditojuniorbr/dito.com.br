-- ==========================================================
-- 🚀 DITO NETWORK - TABELA DE PÁGINAS DE VENDAS
-- ==========================================================

-- 1. Tabela de Páginas
CREATE TABLE IF NOT EXISTS dito_sales_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author TEXT REFERENCES dito_users(username),
    product_id TEXT, -- Relacionamento opcional com produto
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    config JSONB, -- Blocos da página [{type: 'hero', ...}]
    theme JSONB DEFAULT '{"primary": "#000000", "font": "Inter"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE dito_sales_pages;

-- 3. Segurança (RLS Liberado como o resto do app)
ALTER TABLE dito_sales_pages DISABLE ROW LEVEL SECURITY;

-- 4. Adicionar coluna na tabela de produtos para link fácil (Opcional)
ALTER TABLE dito_market_products ADD COLUMN IF NOT EXISTS has_custom_page BOOLEAN DEFAULT false;

-- ============================================
-- TUNEBUDDY KARAOKE - SUPABASE DATABASE SETUP
-- ============================================

-- 1. Tabela de Cantores (usuarios que cantam)
CREATE TABLE IF NOT EXISTS cantores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Pontuações
CREATE TABLE IF NOT EXISTS pontuacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cantor_id UUID REFERENCES cantores(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    musica_titulo VARCHAR(255),
    musica_artista VARCHAR(255),
    video_id VARCHAR(50),
    pontuacao_total INTEGER CHECK (pontuacao_total >= 0 AND pontuacao_total <= 100),
    pontuacao_pitch INTEGER,
    pontuacao_ritmo INTEGER,
    pontuacao_consistencia INTEGER,
    pontuacao_performance INTEGER,
    cenario VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX idx_pontuacoes_cantor ON pontuacoes(cantor_id);
CREATE INDEX idx_pontuacoes_owner ON pontuacoes(owner_id);
CREATE INDEX idx_pontuacoes_data ON pontuacoes(created_at DESC);
CREATE INDEX idx_cantores_nome ON cantores(nome);

-- 4. Row Level Security (RLS)
ALTER TABLE cantores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pontuacoes ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Segurança

-- Cantores: qualquer autenticado pode criar e ler
CREATE POLICY "Cantores: qualquer um pode ler"
    ON cantores FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Cantores: qualquer um pode criar"
    ON cantores FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Pontuações: usuário só pode inserir suas próprias pontuações
CREATE POLICY "Pontuações: qualquer um pode ler"
    ON pontuacoes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Pontuações: usuário pode inserir suas pontuações"
    ON pontuacoes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Pontuações: usuário pode deletar suas pontuações"
    ON pontuacoes FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- 6. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cantores_updated_at
    BEFORE UPDATE ON cantores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. View para Ranking Geral
CREATE OR REPLACE VIEW ranking_geral AS
SELECT 
    c.id,
    c.nome,
    COUNT(p.id) as total_musicas,
    ROUND(AVG(p.pontuacao_total)::numeric, 1) as media_pontos,
    MAX(p.pontuacao_total) as melhor_pontuacao,
    MAX(p.created_at) as ultima_apresentacao
FROM cantores c
LEFT JOIN pontuacoes p ON c.id = p.cantor_id
GROUP BY c.id, c.nome
ORDER BY media_pontos DESC NULLS LAST, total_musicas DESC;

-- 8. View para Ranking por Música
CREATE OR REPLACE VIEW ranking_por_musica AS
SELECT 
    p.video_id,
    p.musica_titulo,
    p.musica_artista,
    c.nome as cantor,
    p.pontuacao_total,
    p.created_at,
    ROW_NUMBER() OVER (PARTITION BY p.video_id ORDER BY p.pontuacao_total DESC) as posicao
FROM pontuacoes p
JOIN cantores c ON p.cantor_id = c.id
ORDER BY p.video_id, p.pontuacao_total DESC;

-- ============================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ============================================

-- Inserir cantores de exemplo
INSERT INTO cantores (nome) VALUES 
    ('Ana Silva'),
    ('Bruno Costa'),
    ('Carla Souza')
ON CONFLICT (nome) DO NOTHING;

-- ============================================
-- FIM DO SETUP
-- ============================================

-- Para verificar se funcionou:
-- SELECT * FROM cantores;
-- SELECT * FROM ranking_geral;

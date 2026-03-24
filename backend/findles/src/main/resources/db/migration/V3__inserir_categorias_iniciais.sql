INSERT INTO CATEGORIA (NOME, DESCRICAO) VALUES
    ('Relatório', 'Documentos de acompanhamento, métricas e resultados gerais.'),
    ('Financeiro', 'Faturas, recibos, balanços e documentação contável.'),
    ('Recursos Humanos', 'Ficheiros de funcionários, folhas de pagamento e currículos.'),
    ('Jurídico', 'Processos, petições e documentação legal externa e interna.'),
    ('Contratos', 'Acordos comerciais, termos de responsabilidade e parcerias.'),
    ('TI e Sistemas', 'Manuais de arquitetura, topologias e documentação técnica.'),
    ('Comercial', 'Propostas comerciais, catálogos de produtos e orçamentos.');

INSERT INTO STATUS_DOCUMENTO (NOME, DESCRICAO) VALUES
   ('Ativo', 'Documento válido e visível nas buscas do sistema.'),
   ('Inativo', 'Documento arquivado, obsoleto ou removido logicamente.');
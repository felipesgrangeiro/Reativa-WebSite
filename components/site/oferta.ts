/**
 * Termos comerciais do diagnóstico, em um lugar só.
 *
 * A oferta aparece em duas formas na home — o cartão da dobra `#oferta` e a
 * faixa compacta logo depois da dobra da diferença. Preço e condição escritos
 * à mão nos dois lugares divergem na primeira vez que um deles muda; já
 * aconteceu nesta landing com a headline da hero, que mudou na página e
 * continuou antiga na imagem de Open Graph.
 *
 * Os valores vêm de `docs/PRICING.md` (decisão comercial de 10/08/2026). O
 * PRAZO não é detalhe: sem ele a página promete abater os R$ 197 para sempre,
 * e o documento registra que crédito sem prazo deixa de ser receita
 * reconhecível. Mexer no preço ou no prazo é mexer aqui, e no documento.
 */

export const DIAGNOSTICO_PRECO = 197;

/** Como o preço é lido em voz alta, ao lado do número. */
export const DIAGNOSTICO_MODALIDADE = "Pagamento único";

/**
 * A condição por extenso, em uma linha.
 *
 * Sem uso desde que o cartão de oferta saiu da home — a faixa escreve a dela em
 * duas linhas, com ícone de calendário, dentro do próprio componente. Mantida
 * porque a página `/precos` prevista em `docs/PRICING.md` precisa exatamente
 * desta frase; se aquela página for descartada, esta constante sai junto.
 */
export const DIAGNOSTICO_CREDITO_LONGO = `Os R$ ${DIAGNOSTICO_PRECO} são abatidos na primeira mensalidade se você assinar em até 30 dias.`;

/**
 * Destinos do site público, em um lugar só.
 *
 * `SALES_CTA` é o destino do botão principal ("Quero uma análise"). Hoje aponta
 * para /contato, que existe e funciona. Quando houver número de WhatsApp
 * comercial, troque só esta constante — nenhuma página conhece o destino.
 */
export const SALES_CTA = "/contato";

/** Login do app (domínio principal). */
export const LOGIN_URL = "https://www.reativamais.com/login";

/** Cadastro do app (domínio principal). */
export const CADASTRO_URL = "https://www.reativamais.com/cadastro";

/** Contato do app (domínio principal). */
export const CONTATO_URL = "https://www.reativamais.com/contato";

/** Termos de uso (domínio principal). */
export const TERMOS_URL = "https://www.reativamais.com/termos";

/** Política de privacidade (domínio principal). */
export const PRIVACIDADE_URL = "https://www.reativamais.com/privacidade";

/** Âncoras dentro da home. */
export const HOME_ANCHORS = {
  comoFunciona: "#como-funciona",
  porQue: "#por-que",
  /** Dobra de personas (dono, recepção, gestor). */
  paraQuem: "#para-quem",
  /** Qualificação por especialidade. */
  tipoDeClinica: "#tipo-de-clinica",
  oferta: "#oferta",
} as const;

export const SITE_NAV = [
  { label: "Como funciona", href: HOME_ANCHORS.comoFunciona },
  { label: "Por que Reativa+", href: HOME_ANCHORS.porQue },
  { label: "Para quem é", href: HOME_ANCHORS.paraQuem },
  { label: "Preços", href: HOME_ANCHORS.oferta },
] as const;

/**
 * Links do rodapé em duas colunas, sem títulos de grupo.
 *
 * São nove links: rotular seria mais estrutura que conteúdo, e o rodapé divide
 * espaço com a assinatura tipográfica — cabeçalho de coluna competiria com ela.
 * Ordem: primeiro o que o visitante ainda quer saber, depois conta e legal.
 */
export const FOOTER_COLUMNS = [
  [
    { label: "Como funciona", href: HOME_ANCHORS.comoFunciona },
    { label: "Por que Reativa+", href: HOME_ANCHORS.porQue },
    { label: "Para quem é", href: HOME_ANCHORS.paraQuem },
    { label: "Preços", href: HOME_ANCHORS.oferta },
    { label: "Ver o painel", href: "/preview/estrategia-consultor" },
  ],
  [
    { label: "Entrar", href: LOGIN_URL },
    { label: "Criar conta", href: CADASTRO_URL },
    { label: "Contato", href: CONTATO_URL },
    { label: "Termos de uso", href: TERMOS_URL },
    { label: "Política de Privacidade", href: PRIVACIDADE_URL },
  ],
] as const;

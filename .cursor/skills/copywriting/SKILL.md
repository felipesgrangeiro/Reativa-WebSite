---
name: copywriting
description: >-
  Writes humanized sales copy for Reativa+ (Reativa Mais): headlines, CTAs,
  offers, scarcity tied to recovery windows, and LP section copy. Use when the
  user asks for copy, copyright (sentido marketing), texto de vendas, headline,
  CTA, escassez, oferta, ou redação da landing Reativa+.
---

# Copywriting Reativa+

Você escreve como o melhor redator de performance do mercado — sem soar robô, sem soar hype vazio. Cada frase tem trabalho: clareza, verdade da oferta, e tensão honesta de tempo.

## Quando aplicar

Pedidos de copy, “copyright”, headline, CTA, escassez, oferta, lead, seção da LP, ou reescrita de texto de vendas da Reativa+.

**Não confundir** com a skill `copyright` (direitos autorais / notices legais).

## Universo do produto (fonte da verdade)

- **Marca:** Reativa+ / Reativa Mais  
- **Promessa:** transformar pacientes perdidos em faturamento recuperável  
- **Mecanismo:** ciclo do procedimento + janela econômica de recuperação  
- **Estados:** Ativo → Em risco → Perdido  
- **Mantra:** “Ainda dá tempo.”  
- **Oferta âncora:** Diagnóstico Reativa+ · **R$ 197** · pagamento único  
- **Escassez real (usar):** a janela fecha; crédito dos R$ 197 vale **30 dias** após o diagnóstico se contratar o produto  
- **CTA padrão:** “Quero meu diagnóstico”  
- **Público:** dono de clínica, recepção, gestor — estética, dermato, odonto com recorrência  
- **Não é para:** atendimento pontual sem ciclo de retorno  

## Tom humanizado

Escreva como alguém que já sentou com o dono da clínica e viu a planilha.

- Frases curtas. Uma ideia por linha quando a seção pede ritmo.  
- Português do Brasil, direto, sem “solução inovadora / disruptiva / revolucionária”.  
- Preferir “sua clínica”, “sua base”, “quem ainda pode voltar”.  
- Pode doer um pouco (dinheiro parado, tempo passando) — sem humilhar.  
- Nunca inventar prova social falsa, “últimas vagas”, countdown mentiroso ou urgência genérica.  

### Escassez permitida (honesta)

| Tipo | Como usar |
|------|-----------|
| Tempo do paciente | A janela de recuperação fecha; depois não entra na conta |
| Tempo da oferta | Crédito de R$ 197 só em até 30 dias após o diagnóstico |
| Custo de espera | Cada semana fora do ciclo aumenta chance de virar “Perdido” |
| Foco | Começar por quem ainda está dentro — não por “inativo há 90 dias” genérico |

### Escassez proibida

- “Só hoje / restam 3 vagas” sem fato comercial  
- Pressão de medo sem relação com o mecanismo do produto  
- Comparar clínica a fracasso pessoal  

## Fórmula rápida (ordem de escrita)

1. **Verdade desconfortável** (o que a clínica já sente)  
2. **Mecanismo** (ciclo + janela — em linguagem humana)  
3. **Prova lógica** (Botox ≠ limpeza de pele; 120 dias ≠ 30)  
4. **Oferta concreta** (diagnóstico / R$ 197 / o que entrega)  
5. **Escassez honesta** (janela / 30 dias de crédito)  
6. **CTA** (uma ação só)

## Banco de voz (referência — adaptar, não copiar em bloco)

**Headlines / ganchos**
- Transforme pacientes perdidos em faturamento.  
- A janela existe. A diferença é saber quem ainda está dentro dela.  
- Ainda dá tempo.  
- Não é captar de novo. É reativar.  

**Leads**
- O Reativa+ mostra por quem começar, quanto ainda está associado a esses relacionamentos e até quando existe oportunidade de agir.  
- Antes de decidir o que fazer, descubra o que existe na sua base.  

**Escassez humanizada**
- Depois do limite, o relacionamento deixa de entrar na conta recuperável.  
- Se você contratar o Reativa+ em até 30 dias após o diagnóstico, os R$ 197 são creditados na primeira mensalidade.  
- Quanto mais a clínica espera, mais nomes saem da janela — sem drama, só calendário.  

**CTAs**
- Primário: Quero meu diagnóstico  
- Secundário: Ver o painel de demonstração  

## Workflow do agente

1. Ler a seção/arquivo alvo e o tom já existente na LP.  
2. Confirmar oferta (preço, prazo, CTA) em `components/site/oferta.ts` se for oferta.  
3. Escrever 2–3 opções quando o pedido for aberto; marcar a **recomendada**.  
4. Aplicar no código só o que o usuário pedir para publicar.  
5. Manter brand first: nenhum headline pode apagar “Reativa+” da hierarquia da página.  

## Checklist antes de entregar

- [ ] Soa falado em voz alta (sem jargão de slide)  
- [ ] Escassez ligada a janela/crédito 30 dias — não a fake urgency  
- [ ] CTA único e claro  
- [ ] Sem keyword stuffing / sem “melhor do Brasil” vazio  
- [ ] Compatível com SEO da página (h1 único, descrição honesta)  

## Formato de saída

```markdown
## Copy Reativa+
**Objetivo:** ...
**Recomendada:**
> ...

**Alternativas:**
1. ...
2. ...

**Escassez usada:** (janela / 30 dias / nenhuma)
**CTA:** ...
```

## Fora de escopo

- Notices legais © → skill `copyright`  
- Sitemap / Search Console → skill `seo-google-sitemaps`  
- Headers / CSP → skill `lp-security`

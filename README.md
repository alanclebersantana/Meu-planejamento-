# Planejar — Planejamento escolar

Aplicativo de planejamento de aulas da educação infantil ao ensino médio.
Funciona offline, instala na tela inicial e guarda tudo no próprio aparelho.

Desenvolvido por Alan Correa.

## O que tem dentro

- **Planos** — ficha completa por turma, com campos que mudam conforme a etapa:
  educação infantil mostra campos de experiência e a rotina em momentos;
  fundamental e médio mostram componente, unidade temática, avaliação e tarefa.
- **Prévia ao vivo** — o plano abre em tela cheia e a ficha vai se montando enquanto
  você digita. Dá para baixar em **PDF** ou **imagem** direto da prévia.
- **Campos personalizáveis** — botão `+ campo` para criar campos de experiência
  próprios e `+ Acrescentar campo à ficha` para incluir quadros novos depois de Recursos.
- **Leitor de código BNCC** — digite `EI02EF06`, `EF15AR02`, `EF69LP03` ou `EM13LGG101`
  e o app explica etapa, ano, componente e número. Banco pessoal de habilidades incluído.
- **Anotações** com data, tema e modo leitura; **check-lists**; **lembretes** com aviso
  no aparelho; **agenda** com calendário interativo.
- **Aparência** — 6 cores, modo claro e escuro, 3 tamanhos de letra e ordem das abas
  configurável. Arraste para a esquerda ou direita para trocar de aba.
- **Cópia de segurança** — exporta e importa um plano avulso ou tudo de uma vez, em `.json`.

## Arquivos

```
index.html      o aplicativo inteiro, em arquivo único
manifest.json   nome, ícones, cores e atalhos do ícone do celular
sw.js           service worker: offline e controle de atualização
icons/          ícones 192, 512, maskable, apple-touch e favicon
.nojekyll       impede o GitHub Pages de processar os arquivos
```

## Como publicar no GitHub Pages

1. Crie um repositório novo (por exemplo `planejar`).
2. Envie **todos** os arquivos desta pasta, mantendo a pasta `icons` como está.
3. No repositório, vá em **Settings → Pages**.
4. Em *Source*, escolha **Deploy from a branch**; em *Branch*, escolha `main` e a pasta `/ (root)`.
5. Salve e espere um ou dois minutos. O endereço fica
   `https://SEU-USUARIO.github.io/planejar/`.

O service worker só funciona em `https`, que é o caso do GitHub Pages.
Abrindo o `index.html` direto do arquivo (`file://`) o app funciona, mas sem instalar.

## Como instalar no celular

Abra o endereço no Chrome, toque nos três pontinhos e escolha
**Adicionar à tela inicial**. Depois de instalado, segure o ícone para ver os
atalhos: novo plano, nova anotação, novo lembrete e agenda.

Para os lembretes avisarem, toque em **Ligar avisos** na aba Lembretes e
autorize as notificações.

## Como publicar uma alteração

Sempre que mudar o `index.html`, abra o `sw.js` e troque a versão na primeira linha:

```js
const VERSAO = 'planejar-v1.0.1';
```

Sem isso o celular continua mostrando a versão antiga que está guardada.
Com a versão nova, o app avisa **"Nova versão pronta — Atualizar"** e se
recarrega sozinho quando a pessoa toca no aviso.

## Onde ficam os dados

Tudo fica no `localStorage` do próprio navegador, na chave `planejar_lousa`.
Nada sai do aparelho. Por isso:

- limpar os dados do navegador apaga os planos;
- trocar de celular não leva os dados junto.

Use **Ajustes → Salvar cópia** de vez em quando. Se um dia quiser sincronizar
entre aparelhos, o caminho é acrescentar Firebase, como no *Vamos ao Mercado?*.

## Dependências externas

Só duas, carregadas da internet e guardadas no cache na primeira vez:

- **Google Fonts** (Caveat e Nunito) — sem internet, o app usa as letras do sistema;
- **html2canvas** e **jsPDF** (cdnjs) — usadas para gerar a imagem e o PDF da ficha.
  Sem elas, o app cai para a impressão do navegador, que também salva em PDF.

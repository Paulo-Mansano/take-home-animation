# Take-Home Animation

App React Native (Expo) focado em **animação fluida** entre telas: a tela de Água (Water) abre a partir do ícone de gota na tela de Passos (Steps) e fecha com animação até o botão ✕. Funciona em **iOS e Android** (Expo Go ou build nativo).

---

## O que o app faz

### Fluxo geral

1. **Tela inicial (Steps)**  
   - Mostra a tela de passos com gráfico, card branco e um **ícone de gota** (🥤) no canto superior direito.

2. **Abrir a tela de Água**  
   - Ao tocar no ícone 🥤, o app mede a posição e o tamanho do botão (`measureInWindow`).  
   - Um overlay **expande** a partir desse retângulo: a “janela” da tela de Água nasce do tamanho do ícone, centralizada nele, e anima até ocupar a tela inteira (translate + scale + borderRadius).  
   - Ao mesmo tempo, a tela de Steps faz um leve “zoom out” (scale 1 → 0,96) e perde um pouco de opacidade.

3. **Tela de Água em tela cheia**  
   - Exibe a tela de hidratação (garrafa, metas, slider em oz, botões +/−) e um botão **✕** no canto superior direito.

4. **Fechar com animação**  
   - Ao tocar no ✕, o app mede a posição do botão.  
   - Um overlay de **colapso** anima a janela de tela cheia até o tamanho e a posição do ✕ (animação inversa da expansão).  
   - No fim da animação, o overlay é desmontado e o app volta para a tela de Steps.

Resumo: **Steps → (tap 🥤) → expansão animada → Water → (tap ✕) → colapso animado → Steps.**

### Detalhes técnicos das animações

- **Expansão** (`CardExpansionOverlay`): `progress` 0 → 1 em 500 ms, easing `Easing.out(Easing.exp)`. Translate + scale + borderRadius interpolados a partir do layout do ícone; opacidade sobe nos primeiros 5% para evitar pisco; sombra aumenta com o progresso.
- **Colapso** (`CardCollapseOverlay`): mesma matemática, `progress` 1 → 0, easing `Easing.in(Easing.exp)`. A janela “mergulha” no botão ✕.
- **Steps ao fundo**: reage ao `expansionProgress` com scale e opacity em `useAnimatedStyle` (worklet).
- Tudo usa **React Native Reanimated** (shared values, `withTiming`, `useAnimatedStyle`, `scheduleOnRN` para callbacks no fim da animação).

---

## Requisitos mínimos

- **Node.js** 18+ (recomendado LTS)
- **npm** 9+ ou **yarn** / **pnpm**
- **Expo Go** no celular (opcional, para rodar sem emulador)
- Para **iOS**: macOS e Xcode (simulador)
- Para **Android**: Android Studio (emulador) ou dispositivo com depuração USB

---

## Como rodar (na raiz do projeto)

Na pasta raiz do projeto (onde estão `package.json` e `src/`):

```bash
npm install
npm start
```

Ou, para abrir direto em uma plataforma:

```bash
npm run android   # emulador ou dispositivo Android
npm run ios       # simulador iOS (apenas em Mac)
npm run web       # navegador (Expo Web)
```

- **Expo Go**: com `npm start`, escaneie o QR code com o app Expo Go (Android ou iOS) para abrir no celular.
- **Android**: dispositivo via USB com “Depuração USB” ativada, ou emulador aberto antes de `npm run android`.
- **iOS**: apenas em Mac; `npm run ios` abre o simulador.

---

## Stack

| Dependência | Uso |
|-------------|-----|
| **Expo** (SDK 54) | Build e execução (Expo Go ou nativo) |
| **React** 19.1 / **React Native** 0.81 | UI |
| **TypeScript** | Tipagem |
| **react-native-reanimated** ~4.1 | Animações (worklets, shared values) |
| **react-native-gesture-handler** | Base para gestos |
| **react-native-worklets** | `scheduleOnRN` para callbacks pós-animação |
| **expo-status-bar** | Estilo da barra de status |

O plugin **react-native-reanimated/plugin** está configurado em `babel.config.js` (obrigatório para Reanimated).

---

## Estrutura do projeto (raiz)

```
.
├── index.js                 # Entrada; registra App com Expo
├── package.json
├── tsconfig.json            # Base Expo + paths @/* → src/*
├── babel.config.js          # babel-preset-expo + reanimated/plugin
├── README.md
│
└── src/
    ├── App.tsx               # Orquestra modos: steps | expanding | water | collapsing
    │
    ├── screens/
    │   ├── StepsScreen.tsx   # Tela de passos; ícone 🥤 mede layout e chama onOpenWater(layout)
    │   └── WaterScreen.tsx   # Tela de água; botão ✕ mede layout e chama onClose(layout)
    │
    ├── components/
    │   ├── CardExpansionOverlay.tsx   # Overlay que expande do ícone → tela cheia
    │   ├── CardCollapseOverlay.tsx    # Overlay que colapsa tela cheia → ícone ✕
    │   ├── OdometerSlider.tsx         # Slider numérico (oz)
    │   ├── WaterSliderBar.tsx         # Barra de valor de água
    │   ├── StatItem.tsx               # Item de estatística (reutilizado em Steps)
    │   ├── Overlay.tsx                # Overlay slide-up (legado/outros fluxos)
    │   ├── NumberSlider.tsx           # Slider vertical tipo “slot”
    │   └── DigitColumn.tsx            # Coluna de dígitos para number slider
    │
    ├── animations/
    │   ├── timings.ts            # Durações e easing (ex.: overlay, número)
    │   ├── useSlideUpAnimation.ts # Hook slide-up reutilizável
    │   └── useOdometerLogic.ts    # Lógica do odômetro
    │
    └── constants/
        ├── layout.ts   # SCREEN_WIDTH, SCREEN_HEIGHT, espaçamentos, sombras
        └── theme.ts    # Paleta (COLORS)
```

Tudo é tratado como na **raiz do projeto**: comandos e paths acima são relativos à pasta que contém `package.json` e `src/`.

---

## Papel dos arquivos principais

| Arquivo | Papel |
|---------|--------|
| `App.tsx` | Estado global: `screenMode`, `triggerLayout`, `collapseLayout`, `expansionProgress`. Renderiza Steps sempre ao fundo (com estilo animado); conforme o modo, monta `CardExpansionOverlay`, `WaterScreen` solta ou `CardCollapseOverlay`. Callbacks: `handleOpenWater`, `handleExpansionComplete`, `handleCloseWater`, `handleCollapseComplete`. |
| `CardExpansionOverlay.tsx` | Recebe o layout do ícone (TriggerLayout), anima `progress` 0→1 e aplica translate/scale/borderRadius/opacity/sombra. Ao terminar, chama `onExpansionComplete`. |
| `CardCollapseOverlay.tsx` | Recebe o layout do alvo (TargetLayout, ex.: botão ✕), anima `progress` 1→0 (mesma interpolação, invertida). Ao terminar, chama `onCollapseComplete`. |
| `StepsScreen.tsx` | Ref no botão 🥤; no press, `measureInWindow` e `onOpenWater({ x, y, width, height })`. Estilo do ícone reage a `expansionProgress`. |
| `WaterScreen.tsx` | Ref no botão ✕; no press, `measureInWindow` e `onClose({ x, y, width, height })`. Conteúdo: garrafa, stats, `OdometerSlider`, `WaterSliderBar`, botões +/−. |

---

## Scripts (raiz)

- `npm start` — inicia o dev server Expo (QR code no terminal).
- `npm run android` — abre no Android.
- `npm run ios` — abre no simulador iOS (Mac).
- `npm run web` — abre no navegador.

Documentação e comandos consideram que você está na **raiz do projeto** (pasta onde está o `package.json`).

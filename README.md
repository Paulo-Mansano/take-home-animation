# Take-Home Animation

Desafio técnico (take-home) focado em **animação fluida** em React Native com Expo. O app funciona em **iOS e Android** (Expo Go ou build nativo).

## Descrição do desafio

O app implementa:

- **Overlay** que sobe da parte inferior da tela com bordas arredondadas e sombra
- **Number slider** vertical com efeito tipo “slot machine” (números animando de 0 até o valor final)
- **Micro-interações**: fade-in e escala (0,95 → 1) em textos secundários, com delays escalonados

Objetivo: fluidez (60fps), uso correto de Reanimated, organização de código e clareza estrutural.

## Stack

- **Expo** (SDK 54 — compatível com o Expo Go da Play Store)
- **React Native** (0.81)
- **TypeScript**
- **React Native Reanimated** (v4)
- **React Native Gesture Handler**

## Como rodar

```bash
cd take-home-animation
npm install
npx expo start
```

- **Android (emulador ou dispositivo)**: no terminal, pressione `a` ou use `npx expo start --android`. Conecte um aparelho via USB com depuração USB ativada, ou use o emulador Android.
- **Expo Go**: escaneie o QR code com o app Expo Go (Android ou iOS) para abrir o projeto no celular.
- **iOS**: se tiver Mac, pressione `i` ou use `npx expo start --ios` para o simulador.

Ao abrir o app, aguarde a animação (overlay sobe, número anima, itens aparecem). Use **Replay** para rodar de novo e **Próximo número** para animar até outro dígito (0–9).

## Estrutura do projeto

```
take-home-animation/
  src/
    components/
      Overlay.tsx      # Overlay slide-up (usa useSlideUpAnimation)
      NumberSlider.tsx # Slider vertical tipo slot machine
      StatItem.tsx     # Item de texto com fade + scale
    animations/
      timings.ts           # Durações e easing centralizados
      useSlideUpAnimation.ts # Hook do overlay (reutilizável)
    constants/
      layout.ts        # Dimensões, espaçamentos, sombra
    App.tsx
  index.js             # Entrada; importa src/App
  babel.config.js      # Plugin do Reanimated
  tsconfig.json
```

## Estratégia de animação

- **Shared values e worklets**: Todas as animações usam `useSharedValue` e `useAnimatedStyle` do Reanimated (sem Animated API do RN e sem `setTimeout` para animar).
- **Timings centralizados**: `src/animations/timings.ts` exporta `overlayDuration`, `numberDuration`, `easingCurve` (Bezier) e delays das micro-interações; nenhum valor mágico nos componentes.
- **Overlay**: `useSlideUpAnimation` encapsula o slide-up (translateY de `SCREEN_HEIGHT` → 0) com `withTiming` e easing; o Overlay usa esse hook e aplica o estilo animado + estilos estáticos de layout/sombra.
- **Number slider**: Stack vertical de dígitos (0–9), container com altura fixa e `overflow: 'hidden'`. Um shared value animado com `withTiming` controla o `translateY` do stack (proporcional ao valor), gerando o efeito contínuo sem “jump”.
- **Micro-interações**: Cada `StatItem` anima opacidade e escala com `withDelay` (atraso inicial + stagger por índice) e `withTiming` usando o mesmo `easingCurve`.

Extras implementados: botão **Replay** (remonta o overlay e refaz a sequência), valor **dinâmico** do número (botão “Próximo número”) e hook **useSlideUpAnimation** para reutilização e clareza.

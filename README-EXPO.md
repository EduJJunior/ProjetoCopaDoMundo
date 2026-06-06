Migração rápida para Expo (Expo Go)

1) Instalar o `create-expo-app` e criar o scaffold:

```bash
npx create-expo-app expo-app --template blank --name AlbumCopa
```

2) Executar o script que copia seus arquivos do projeto atual para `expo-app`:

```bash
node scripts/copyToExpo.js
```

3) Entrar em `expo-app`, ajustar `package.json` (remover/atualizar dependências incompatíveis) e instalar dependências:

```bash
cd expo-app
npm install
# ou yarn
```

4) Iniciar o Expo DevTools e abrir no Expo Go (celular) ou emulador:

```bash
npx expo start
```

Observações:
- Algumas dependências do React Navigation e bibliotecas nativas podem precisar de ajustes (use as versões compatíveis com Expo). Consulte a documentação do Expo para instalar `react-native-screens` e `react-native-safe-area-context` com as versões corretas.
- Se preferir, eu posso tentar automatizar a atualização de `package.json` dentro de `expo-app` para versões compatíveis com Expo — me diga se quer que eu faça isso.

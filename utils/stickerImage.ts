type StickerLike = {
  id: string;
  nome: string;
  title?: string;
  type?: string;
  selecao?: string;
  imagem?: unknown;
};

const TYPE_COLORS: Record<string, string> = {
  player: '8A1538',
  team: '006847',
  stadium: '2C3E50',
  mascot: 'D4A017',
  coach: '1A1A2E',
};

const TYPE_EMOJI: Record<string, string> = {
  player: '⚽',
  team: '🏳️',
  stadium: '🏟️',
  mascot: '🐺',
  coach: '📋',
};

export function getStickerEmoji(type?: string): string {
  return TYPE_EMOJI[type ?? 'player'] ?? '⭐';
}

export function getStickerImageUri(item: StickerLike): string {
  const name = encodeURIComponent(item.title ?? item.nome);
  const type = item.type ?? 'player';
  const background = TYPE_COLORS[type] ?? TYPE_COLORS.player;
  return `https://ui-avatars.com/api/?name=${name}&background=${background}&color=fff&size=512&bold=true&format=png`;
}

export function resolveImageSource(item: StickerLike) {
  const fallbackUri = getStickerImageUri(item);
  const raw = item.imagem;

  if (typeof raw === 'number') {
    return raw;
  }

  if (typeof raw === 'string') {
    if (raw.includes('via.placeholder.com') || raw.includes('placeholder')) {
      return { uri: fallbackUri };
    }
    return { uri: raw };
  }

  if (raw && typeof raw === 'object' && 'uri' in (raw as { uri?: string })) {
    const uri = (raw as { uri: string }).uri;
    if (uri.includes('via.placeholder.com') || uri.includes('placeholder')) {
      return { uri: fallbackUri };
    }
    return raw as { uri: string };
  }

  if (raw) {
    return raw;
  }

  return { uri: fallbackUri };
}

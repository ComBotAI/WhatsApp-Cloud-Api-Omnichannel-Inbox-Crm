/**
 * Finds an approved WhatsApp template by name (and language) among the ones on
 * the phone, so a sent template can be drawn / previewed with its real text.
 */
import type { Template } from '@ab-ecosystem/cpaas';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useTemplates, useWaChannels } from '@/hooks/queries';
import { cachedTemplates } from '@/services/crm/whatsapp';

export type TemplateLookup = (name: string, language: string) => Template | undefined;

/** `channelId`: the channel whose templates to make sure are downloaded (default: the first WhatsApp number). */
export const useTemplateLookup = (channelId?: string | null): TemplateLookup => {
  const qc = useQueryClient();
  const waChannels = useWaChannels();
  const templates = useTemplates(channelId || waChannels.data?.[0]?.id || null);
  return useCallback(
    (name: string, language: string) => {
      const match = (x: Template) => x.name === name && (!language || x.language === language);
      for (const [, data] of qc.getQueriesData<Template[]>({ queryKey: ['wa', 'templates'] })) {
        const hit = data?.find(match);
        if (hit) return hit;
      }
      for (const ch of waChannels.data ?? []) {
        const hit = cachedTemplates(ch.id)?.templates.find(match);
        if (hit) return hit;
      }
      return undefined;
    },
    // `dataUpdatedAt`: a new identity once templates arrive, so what uses it re-renders with them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qc, waChannels.data, templates.dataUpdatedAt],
  );
};

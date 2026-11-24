/**
 * Message text with tappable links: web addresses open in the in-app browser
 * (a new tab on web), emails open the mail app, phone numbers open the dialer.
 */
import * as WebBrowser from 'expo-web-browser';
import type { ReactNode } from 'react';
import { Linking, Platform, type TextStyle } from 'react-native';

import { Text } from '@/components/ui';
import { toDialable } from '@/lib/phone';

// Common endings, so "file.txt" or "v1.2" aren't taken for websites when there's no http:// or www.
const TLD = 'com|net|org|io|co|in|au|uk|us|ca|nz|ie|de|fr|es|it|nl|eu|ae|sg|my|za|app|dev|ai|me|biz|info|xyz|site|online|store|shop|tech|website|page|link|cloud|digital|agency|services';
const PATTERN = new RegExp(
  `(https?:\\/\\/[^\\s<]+|www\\.[^\\s<]+|[\\w.+-]+@[\\w-]+\\.[\\w.-]+|\\+?\\d[\\d\\s-]{7,}\\d|[a-z0-9][a-z0-9-]*(?:\\.[a-z0-9-]+)*\\.(?:${TLD})\\b(?:\\/[^\\s<]*)?)`,
  'gi',
);

/** Where a matched token points. Trailing punctuation is part of the sentence, not the link. */
const hrefFor = (token: string): { href: string; web: boolean } => {
  if (/^[\w.+-]+@/.test(token)) return { href: `mailto:${token.replace(/[).,!?;:]+$/, '')}`, web: false };
  if (/^\+?\d[\d\s-]+$/.test(token)) return { href: `tel:${toDialable(token)}`, web: false };
  const url = (/^https?:\/\//i.test(token) ? token : `https://${token}`).replace(/[).,!?;:]+$/, '');
  return { href: url, web: true };
};

const open = (token: string) => {
  const { href, web } = hrefFor(token);
  if (!web) return void Linking.openURL(href).catch(() => {});
  void WebBrowser.openBrowserAsync(href).catch(() => Linking.openURL(href));
};

/** Splits text into plain strings and tappable link nodes, for use inside a <Text>. */
export function linkify(text: string, linkColor: string, keyPrefix = ''): ReactNode[] {
  const isWeb = Platform.OS === 'web';
  const linkStyle = { color: linkColor, textDecorationLine: 'underline' as const };
  return text.split(PATTERN).map((p, i) => {
    if (i % 2 === 0) return p;
    const key = `${keyPrefix}${i}`;
    if (isWeb) {
      // A real <a>: opens in a new tab, and middle-click / right-click work as usual.
      const { href, web } = hrefFor(p);
      const anchor = { href, hrefAttrs: web ? { target: '_blank', rel: 'noopener noreferrer' } : undefined } as object;
      return (
        <Text key={key} style={linkStyle} {...anchor}>
          {p}
        </Text>
      );
    }
    return (
      <Text key={key} style={linkStyle} onPress={() => open(p)} suppressHighlighting={false}>
        {p}
      </Text>
    );
  });
}

export function LinkText({ text, style, linkColor }: { text: string; style?: TextStyle; linkColor: string }) {
  return (
    // On Android a `selectable` parent swallows taps on nested links; copying is in the long-press menu.
    <Text selectable={Platform.OS === 'web'} style={style}>
      {linkify(text, linkColor)}
    </Text>
  );
}

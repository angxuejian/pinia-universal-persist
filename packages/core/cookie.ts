import { safeJSONParse } from './utils';

export const cookie = {
  set(name: string, value: any, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
  },
  get(name: string) {
    const match = (key: string) => {
      const match = document.cookie.match(new RegExp('(^|;)\\s*' + key + '=([^;]*)'));
      return match ? safeJSONParse(decodeURIComponent(match[2])) : null;
    };
    return match(name);
  },
  remove(name: string) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  },
};

import { env } from '~/config/environment'

export const WHITELIST_DOMAINS = [
  // config/cors always allow localhost when in dev mode
  // 'http://localhost:5173'
  'https://trello-web-tau-red.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

// config web domain for email verification with production and development mode
export const WEBSITE_DOMAIN = env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12
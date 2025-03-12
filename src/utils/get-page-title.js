import defaultSettings from '@/settings'

const title = defaultSettings.title || '伏羲云系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

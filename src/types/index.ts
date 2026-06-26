export interface KPICardData {
  title: string
  value: string
  trend: string
  bgColor: string
  textColor: string
}

export interface MetricCardData {
  title: string
  value: string
  trend: string
  trendIcon: 'up' | 'down' | 'neutral'
}

export interface NavItem {
  label: string
  icon?: string
  path?: string
  children?: NavItem[]
  isActive?: boolean
  isExpanded?: boolean
}

export interface ChartDataPoint {
  name: string
  value: number
  value2?: number
}

export type { BannerConfig, BannerTier, BannerCategory, DismissType, BannerAction, HighlightField, BannerTargeting } from './banner'

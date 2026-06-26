import type { OrderAlert } from '../common/OrderAlertBanner'

export const DASHBOARD_ALERTS: OrderAlert[] = [
  {
    id: 'dash-security-1',
    type: 'suspicious-login',
    title: '安全提醒：检测到异常登录',
    message: '您的账号于 2026-06-25 03:42 从异常 IP 地址（美国 · 迈阿密）登录。如非本人操作，请立即修改密码并检查账号安全设置。',
    refId: 'IP: 192.168.x.x',
    severity: 'high',
    actionLabel: '检查登录记录',
    actionPath: '/messages',
    secondaryActionLabel: '修改密码',
    secondaryActionPath: '/messages',
  },
]

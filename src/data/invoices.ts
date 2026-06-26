export interface Invoice {
  id: string
  invoiceNumber: string
  status: 'PAST_DUE' | 'PAID' | 'PENDING'
  customer: string
  proNumber: string
  invoiceDate: string
  totalAmount: number
  balance: number
  // Detail fields
  bolNumber?: string
  puNumber?: string
  issueDate?: string
  dueDate?: string
  amount?: number
  outstandingBalance?: number
  remitTo?: {
    company: string
    address: string
  }
  deliverTo?: {
    name: string
    address: string
  }
  shipFrom?: {
    name: string
    address: string
  }
  billTo?: {
    name: string
    email: string
    phone: string
  }
  rateBreakdown?: {
    poNumber: string
    shipDate: string
  }
  items?: {
    name: string
    packageType: string
    weight: string
  }[]
}

export interface PaymentMethod {
  id: string
  type: 'visa' | 'mastercard'
  lastFour: string
  nameOnCard: string
  cardNumber: string
  expMonth: string
  expYear: string
  securityCode: string
  streetAddress: string
}

export const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: '19043770',
    status: 'PAST_DUE',
    customer: 'SUNPOWER CORPORATION',
    proNumber: '-',
    invoiceDate: 'August 26,2025',
    totalAmount: 944.6,
    balance: 924.6,
    bolNumber: 'ITEM10326',
    puNumber: '10326',
    issueDate: '27-11-2025 12:00 AM',
    dueDate: '27-11-2025 12:00 AM',
    amount: 0,
    outstandingBalance: 350.33,
    remitTo: {
      company: 'ITEM',
      address: '218 Machlin Court Walnut, CA 91780',
    },
    deliverTo: {
      name: '90045name',
      address: 'Westchester, CA 90045',
    },
    shipFrom: {
      name: '90210 name',
      address: 'Beverly Hills, CA 90210',
    },
    billTo: {
      name: 'staging zheng',
      email: 'N/A',
      phone: 'N/A',
    },
    rateBreakdown: {
      poNumber: 'ITEM10326',
      shipDate: 'N/A',
    },
    items: [],
  },
  {
    id: '2',
    invoiceNumber: '19043760',
    status: 'PAST_DUE',
    customer: 'SUNPOWER CORPORATION',
    proNumber: '-',
    invoiceDate: 'February 14,2025',
    totalAmount: 600.35,
    balance: 589.35,
    bolNumber: 'ITEM10320',
    puNumber: '10320',
    issueDate: '14-02-2025 12:00 AM',
    dueDate: '14-02-2025 12:00 AM',
    amount: 0,
    outstandingBalance: 589.35,
    remitTo: {
      company: 'ITEM',
      address: '218 Machlin Court Walnut, CA 91780',
    },
    deliverTo: {
      name: '90045name',
      address: 'Westchester, CA 90045',
    },
    shipFrom: {
      name: '90210 name',
      address: 'Beverly Hills, CA 90210',
    },
    billTo: {
      name: 'staging zheng',
      email: 'N/A',
      phone: 'N/A',
    },
    rateBreakdown: {
      poNumber: 'ITEM10320',
      shipDate: 'N/A',
    },
    items: [],
  },
  {
    id: '3',
    invoiceNumber: '1000001377-1',
    status: 'PAST_DUE',
    customer: 'EVELYN_DEPOSIT',
    proNumber: '1000001377',
    invoiceDate: 'November 27,2025',
    totalAmount: 0,
    balance: 350.33,
    bolNumber: 'ITEM10326',
    puNumber: '10326',
    issueDate: '27-11-2025 12:00 AM',
    dueDate: '27-11-2025 12:00 AM',
    amount: 0,
    outstandingBalance: 350.33,
    remitTo: {
      company: 'ITEM',
      address: '218 Machlin Court Walnut, CA 91780',
    },
    deliverTo: {
      name: '90045name',
      address: 'Westchester, CA 90045',
    },
    shipFrom: {
      name: '90210 name',
      address: 'Beverly Hills, CA 90210',
    },
    billTo: {
      name: 'staging zheng',
      email: 'N/A',
      phone: 'N/A',
    },
    rateBreakdown: {
      poNumber: 'ITEM10326',
      shipDate: 'N/A',
    },
    items: [],
  },
  {
    id: '4',
    invoiceNumber: '100208-1',
    status: 'PAST_DUE',
    customer: 'EVELYN_DEPOSIT',
    proNumber: '100208',
    invoiceDate: 'March 3,2026',
    totalAmount: 0,
    balance: 146.09,
    bolNumber: 'ITEM10400',
    puNumber: '10400',
    issueDate: '03-03-2026 12:00 AM',
    dueDate: '03-03-2026 12:00 AM',
    amount: 0,
    outstandingBalance: 146.09,
    remitTo: {
      company: 'ITEM',
      address: '218 Machlin Court Walnut, CA 91780',
    },
    deliverTo: {
      name: '90045name',
      address: 'Westchester, CA 90045',
    },
    shipFrom: {
      name: '90210 name',
      address: 'Beverly Hills, CA 90210',
    },
    billTo: {
      name: 'staging zheng',
      email: 'N/A',
      phone: 'N/A',
    },
    rateBreakdown: {
      poNumber: 'ITEM10400',
      shipDate: 'N/A',
    },
    items: [],
  },
  {
    id: '5',
    invoiceNumber: '100206-1',
    status: 'PAST_DUE',
    customer: 'EVELYN_DEPOSIT',
    proNumber: '100206',
    invoiceDate: 'March 3,2026',
    totalAmount: 0,
    balance: 300,
    bolNumber: 'ITEM10398',
    puNumber: '10398',
    issueDate: '03-03-2026 12:00 AM',
    dueDate: '03-03-2026 12:00 AM',
    amount: 0,
    outstandingBalance: 300,
    remitTo: {
      company: 'ITEM',
      address: '218 Machlin Court Walnut, CA 91780',
    },
    deliverTo: {
      name: '90045name',
      address: 'Westchester, CA 90045',
    },
    shipFrom: {
      name: '90210 name',
      address: 'Beverly Hills, CA 90210',
    },
    billTo: {
      name: 'staging zheng',
      email: 'N/A',
      phone: 'N/A',
    },
    rateBreakdown: {
      poNumber: 'ITEM10398',
      shipDate: 'N/A',
    },
    items: [],
  },
  {
    id: '6',
    invoiceNumber: '100205-1',
    status: 'PAST_DUE',
    customer: 'EVELYN_DEPOSIT',
    proNumber: '100205',
    invoiceDate: 'March 3,2026',
    totalAmount: 0,
    balance: 23.24,
    bolNumber: 'ITEM10397',
    puNumber: '10397',
    issueDate: '03-03-2026 12:00 AM',
    dueDate: '03-03-2026 12:00 AM',
    amount: 0,
    outstandingBalance: 23.24,
    remitTo: {
      company: 'ITEM',
      address: '218 Machlin Court Walnut, CA 91780',
    },
    deliverTo: {
      name: '90045name',
      address: 'Westchester, CA 90045',
    },
    shipFrom: {
      name: '90210 name',
      address: 'Beverly Hills, CA 90210',
    },
    billTo: {
      name: 'staging zheng',
      email: 'N/A',
      phone: 'N/A',
    },
    rateBreakdown: {
      poNumber: 'ITEM10397',
      shipDate: 'N/A',
    },
    items: [],
  },
]

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'visa',
    lastFour: '1111',
    nameOnCard: 'tt',
    cardNumber: '4111111111111111',
    expMonth: '06',
    expYear: '28',
    securityCode: '999',
    streetAddress: '323',
  },
  {
    id: 'pm-2',
    type: 'mastercard',
    lastFour: '3123',
    nameOnCard: 'tt',
    cardNumber: '5213131231233123',
    expMonth: '09',
    expYear: '29',
    securityCode: '999',
    streetAddress: '456',
  },
]

export function getInvoiceSummaryStats() {
  const paid = invoices.filter((i) => i.status === 'PAID').length
  const deposit = 1127.91
  const outstanding = 0
  const pastDue = invoices.reduce((sum, i) => (i.status === 'PAST_DUE' ? sum + i.balance : sum), 0)
  return { paid, deposit, outstanding, pastDue }
}

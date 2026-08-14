import { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'Customer' | 'Carrier' | 'Broker'

interface RoleContextType {
  role: Role
  setRole: (r: Role) => void
}

const RoleContext = createContext<RoleContextType>({
  role: 'Customer',
  setRole: () => {},
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Customer')
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}

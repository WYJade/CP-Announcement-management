import { createContext, useContext, useState } from 'react'

interface AssistantContextType {
  assistantOpen: boolean
  setAssistantOpen: (open: boolean) => void
}

const AssistantContext = createContext<AssistantContextType>({
  assistantOpen: false,
  setAssistantOpen: () => {},
})

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [assistantOpen, setAssistantOpen] = useState(false)
  return (
    <AssistantContext.Provider value={{ assistantOpen, setAssistantOpen }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  return useContext(AssistantContext)
}

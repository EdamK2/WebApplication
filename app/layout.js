import { ClerkProvider } from '@clerk/nextjs'
import UserSync from './_components/UserSync'
import Header from './_components/Header'  // Assurez-vous que le chemin est correct

import './globals.css'  // Ajoutez cette ligne

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <UserSync />
          <Header />  {/* Ajoutez le Header ici */}
          <main>
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}
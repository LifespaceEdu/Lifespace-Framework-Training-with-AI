import './globals.css'

export const metadata = {
  title: 'Lifespace Education Guide',
  description: 'AI-powered guide for personalized learning',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

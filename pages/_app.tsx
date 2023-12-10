import { ToastContainer } from 'react-toastify'
import '@/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import { Providers } from '@/services/provider'
import type { AppProps } from 'next/app'
import Header from '@/components/Header'

export default function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState<boolean>(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild || typeof window === 'undefined') {
    return null
  } else {
    return (
      <Providers pageProps={pageProps}>
        <div className="bg-[#010922] min-h-screen">
          <Header />
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Providers>
    )
  }
}

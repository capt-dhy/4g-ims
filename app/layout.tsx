import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "4G-IMS | Enterprise Inventory Control",
  description: "Cloud-native inventory management system powered by MongoDB and Node.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <div className="d-flex flex-column flex-lg-row">
            <Sidebar />
            <main 
              className="flex-grow-1 min-vh-100" 
              style={{ 
                marginLeft: '0',
                paddingTop: '70px' // Height of mobile header
              }}
            >
              <div 
                className="desktop-margin"
                style={{ 
                  transition: 'margin-left 0.3s ease'
                }}
              >
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton />

        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 992px) {
            main {
              margin-left: 280px !important;
              padding-top: 0 !important;
            }
          }
        `}} />
      </body>
    </html>
  );
}

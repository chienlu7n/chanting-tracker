import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "🌸皮克敏の唱題日記🌿",
  description: "記錄每天的唱題進度，與皮克敏一起精進修行",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Huninn&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Huninn', sans-serif", margin: 0, backgroundColor: '#f0f4e8' }}>
        {children}
      </body>
    </html>
  );
}
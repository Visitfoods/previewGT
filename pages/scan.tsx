'use client';

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import QRScanner from '../components/QRScanner';

const ScanPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Scanner QR | Gelatomania AR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="container">
        <header>
          <Link href="/">
            <span className="back-link">← Voltar</span>
          </Link>
          <h1>Escanear QR Code</h1>
        </header>

        <main>
          <div className="scanner-content">
            <QRScanner />
          </div>
        </main>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        header {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 10px;
          border-radius: 8px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .back-link {
          color: #4CAF50;
          text-decoration: none;
          cursor: pointer;
          margin-right: 20px;
          font-weight: bold;
        }

        h1 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .scanner-content {
          width: 100%;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      `}</style>
    </>
  );
};

export default ScanPage; 
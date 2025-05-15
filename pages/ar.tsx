'use client';

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import ARViewer from '../components/ARViewer';
import { defaultModel } from '../Models/models';

const ARPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Gelatomania AR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="container">
        <header>
          <Link href="/">
            <span className="back-link">← Voltar</span>
          </Link>
          <h1>Realidade Aumentada</h1>
        </header>

        <main>
          <div className="ar-content">
            <ARViewer modelPath={defaultModel.path} />
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
        }

        .back-link {
          color: #4CAF50;
          text-decoration: none;
          cursor: pointer;
        }

        h1 {
          margin: 20px 0;
          color: #333;
        }

        .ar-content {
          width: 100%;
          height: calc(100vh - 150px);
          min-height: 400px;
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ARPage; 
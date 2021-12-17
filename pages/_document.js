import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="theme-color" content="#000000" />
                    <link rel="icon" href="/img/brand/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="76x76" href="/img/brand/apple-icon.png" />
                    <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
                </Head>
                <body className="text-blueGray-700 antialiased">
                    <div id="page-transition"></div>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

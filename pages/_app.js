import React from 'react';
import ReactDOM from 'react-dom';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';

import PageChange from 'components/PageChange/PageChange.js';

import 'public/katex/katex.min.css';
import 'public/css/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'antd/dist/antd.css';
import 'public/css/customs.css';

Router.events.on('routeChangeStart', url => {
    if (url == '/auth/login') {
        return;
    }
    //console.log(`Loading: ${url}`);
    document.body.classList.add('body-page-transition');
    ReactDOM.render(<PageChange path={url} />, document.getElementById('page-transition'));
});
Router.events.on('routeChangeComplete', () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
    document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
    document.body.classList.remove('body-page-transition');
});

export default class MyApp extends App {
    componentDidMount() {
        const comment = document.createComment(`Made by:
         Nguyen Anh Tuan - Backend Developer, Deployment
         Email: tuananhvd1998@gmail.com
         Github: https://github.com/nguyenanhtuan0612

         Pham Trong Bao - Frontend Developer,
         Email: baovdqn2@gmail.com
         Github: https://github.com/baovdqn
         
        `);
        document.insertBefore(comment, document.documentElement);
    }
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }
    render() {
        const { Component, pageProps } = this.props;

        const Layout = Component.layout || (({ children }) => <>{children}</>);

        return (
            <React.Fragment>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <title>EduMaps Admin</title>
                </Head>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </React.Fragment>
        );
    }
}

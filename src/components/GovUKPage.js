import React from 'react'
import Header from './Header';
import ImageEditor from './ImageEditor';
import Page from '../proposed/Page';

    const pageHolder = () => (
        <div className="MainPage">
            <Page>
                <Header/>
                <ImageEditor/>
            </Page>
        </div>
    );
export default pageHolder
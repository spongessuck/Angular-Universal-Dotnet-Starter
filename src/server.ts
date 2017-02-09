import 'angular2-universal-polyfills/node';
import './__2.1.1.workaround.ts';
import { createServerRenderer } from 'aspnet-prerendering';

import { enableProdMode } from '@angular/core';
import { platformNodeDynamic } from 'angular2-universal';

// Grab the (Node) server-specific NgModule
import { AppModule } from './app/app.node.module';

// import { metaStore } from 'app-shared';

enableProdMode();

declare var Zone: any;

export default createServerRenderer( params => {
    return new Promise<{ html: string, globals?: any }>( resolve => {
        render(params).then(resolve, err => {
            console.error(err);
            resolve({
                html: '<html><head></head><body>Loading...</body></html>'
            });
        });
    });
});

export function render(params: IParams): Promise<{ html: string, globals?: any }> {
    // Our Root application document
    const doc = require('fs').readFileSync('./client/index.html', 'utf8');

    // hold platform reference
    const platformRef = platformNodeDynamic();

    // Use preboot if it's installed
    let prebootInstalled: boolean;
    try {
        prebootInstalled = !!require.resolve('preboot');
    } catch (er) {
        prebootInstalled = false;
    }

    let platformConfig = {
        ngModule: AppModule,
        document: doc,
        preboot: prebootInstalled,
        baseUrl: params.baseUrl,
        requestUrl: params.url,
        originUrl: params.origin
    };

    // defaults
    let cancel = false;

    const _config = Object.assign({
        get cancel() { return cancel; },
        cancelHandler() { return Zone.current.get('cancel'); }
    }, platformConfig);

    // for each user
    const zone = Zone.current.fork({
        name: 'UNIVERSAL request',
        properties: _config
    });


    return Promise.resolve(
        zone.run(() => {
            return platformRef.serializeModule(Zone.current.get('ngModule'));
        })
    ).then(html => {

        // Something went wrong, return the original blank document at least
        if (typeof html !== 'string') {
            return { html: doc };
        }

        /*  Successfully serialized Application
         *  You can pass "Globals" here if you want to pass some data to every request
         *  (also you could pass in params.data if you want to pass data from the server that came through the Views/Index.cshtml page
         *   inside of the asp-prerender-data="" attribute
         *      globals: params.data
         */
        return { html, globals: params.data };

    }).catch(err => {

        console.log(err);
        return { html: doc };

    });

}

export interface IParams {
    origin: string;
    url: string;
    absoluteUrl: string;
    baseUrl: string;
    data: {}; // custom user data sent from server (through asp-prerender-data="" attribute on index.cshtml)
}
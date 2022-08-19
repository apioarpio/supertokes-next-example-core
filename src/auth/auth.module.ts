import {
    MiddlewareConsumer,
    Module,
    NestModule,
    DynamicModule,
} from '@nestjs/common';

import {AuthMiddleware} from './auth.middleware';
import {ConfigInjectionToken, AuthModuleConfig} from './config.interface';
import {SupertokensService} from './supertokens/supertokens.service';

@Module({
    imports: [
        AuthModule.forRoot({
            // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
            connectionURI: "http://localhost:3567",
            // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
            appInfo: {
                // Learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
                appName: "sample",
                apiDomain: "http://localhost:3000",
                websiteDomain: "http://localhost:5173",
                apiBasePath: "/auth",
                websiteBasePath: "/auth"
            },
        }),
    ],
    exports: [],
    controllers: [],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*');
    }

    static forRoot({connectionURI, apiKey, appInfo}: AuthModuleConfig): DynamicModule {
        return {
            providers: [
                {
                    useValue: {
                        appInfo,
                        connectionURI,
                        apiKey,
                    },
                    provide: ConfigInjectionToken,
                },
                SupertokensService,
            ],
            exports: [],
            imports: [],
            module: AuthModule,
        };
    }
}

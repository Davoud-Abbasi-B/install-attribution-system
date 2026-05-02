import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Install Attribution API')
    .setDescription(`Internal MVP API for tracking Ghabzino app installs.

Workflow:
1. Create an install link using POST /api/v1/install-links
2. Use the returned install_url in campaigns, SMS, banners, or ad networks
3. User clicks the public /i/:token link
4. Backend saves an install_click and redirects the user to the store URL
5. The redirect URL includes ayanco_install_click_id and ayanco_token
6. The app reads the referrer on first open
7. The app sends install open data to POST /api/v1/install-opens
8. The backend attributes the install as attributed, organic, invalid_click, or duplicate
9. Summary reports are available from GET /api/v1/install-reports/summary

Protected APIs require:
x-api-key: dev-install-api-key

Public APIs:
GET /api/v1/health
GET /api/v1/ready
GET /i/:token`)
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .addSecurityRequirements('api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Install Attribution API Docs',
    customCss: `
      body { background: #0f172a; }
      .swagger-ui { color: #e5e7eb; }
      .swagger-ui .topbar { background-color: #020617; }
      .swagger-ui .scheme-container,
      .swagger-ui .opblock,
      .swagger-ui .info,
      .swagger-ui .model-box,
      .swagger-ui section.models { background: #111827 !important; color: #e5e7eb !important; border-color: #334155 !important; }
      .swagger-ui .info .title,
      .swagger-ui .info p,
      .swagger-ui .opblock .opblock-summary-path,
      .swagger-ui .opblock .opblock-summary-description,
      .swagger-ui label,
      .swagger-ui table,
      .swagger-ui .parameter__name,
      .swagger-ui .parameter__type,
      .swagger-ui .response-col_status,
      .swagger-ui .response-col_description,
      .swagger-ui .model-title,
      .swagger-ui .model,
      .swagger-ui .prop-type,
      .swagger-ui .prop-format { color: #e5e7eb !important; }
      .swagger-ui input,
      .swagger-ui textarea,
      .swagger-ui select { background: #020617 !important; color: #f9fafb !important; border: 1px solid #334155 !important; }
      .swagger-ui .btn { background: #1e293b !important; color: #f9fafb !important; border-color: #475569 !important; }
      .swagger-ui .opblock-tag { color: #f9fafb !important; border-bottom-color: #334155 !important; }
      .swagger-ui .highlight-code,
      .swagger-ui .microlight { background: #020617 !important; color: #e5e7eb !important; }
    `,
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

void bootstrap();

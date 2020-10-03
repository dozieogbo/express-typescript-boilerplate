import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage as classTransformerMetadataStorage } from 'class-transformer/storage';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import config from './config';
import { AuthController } from './controllers/AuthController';

const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage,
  refPointerPrefix: '#/components/schemas/',
});

const storage = getMetadataArgsStorage();
const swaggerDoc = routingControllersToSpec(
  storage,
  {
    controllers: [AuthController],
    routePrefix: config.app.routePrefix,
  },
  {
    components: { schemas },
    info: {
      title: config.app.name,
      version: '1.0.0',
    },
  },
);

swaggerDoc.servers = [
  {
    url: `${config.app.scheme}://${config.app.host}`,
  },
];

export default swaggerDoc;

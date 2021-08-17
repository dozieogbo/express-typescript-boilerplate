import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import config from './config';
import { AuthController } from './controllers/AuthController';

const schemas = validationMetadatasToSchemas({
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

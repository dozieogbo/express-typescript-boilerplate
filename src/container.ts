import { Container } from 'typedi';
import { useContainer as classValidatorUseContainer } from 'class-validator';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { useContainer as ormUseContainer } from 'typeorm';

export default {
  setup() {
    classValidatorUseContainer(Container);
    routingUseContainer(Container);
    ormUseContainer(Container);
  },
};

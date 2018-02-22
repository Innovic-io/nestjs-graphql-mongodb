import { MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { apolloUploadExpress } from 'apollo-upload-server';

import { PetsModule } from './modules/pets/main.module';
import { ScalarResolver } from './modules/scalars/scalar.resoler';

@Module({
  imports: [
    PetsModule,
    GraphQLModule,
  ],
  controllers: [],
  components: [],
})
export class ApplicationModule {
  constructor(
    private readonly graphQLFactory: GraphQLFactory) {}

  configure(consumer: MiddlewaresConsumer) {
    const schema = this.createSchema();

    consumer
      .apply([
        apolloUploadExpress(),
        graphiqlExpress({ endpointURL: '/graphql' }),
      ])
      .forRoutes({ path: '/graphiql', method: RequestMethod.GET })
      .apply(graphqlExpress(req => ({ schema, rootValue: req })))
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }

  createSchema() {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    return this.graphQLFactory.createSchema({
      typeDefs,
      resolvers: ScalarResolver,
    });
  }
}

import { Module } from '@nestjs/common';
import { PetsResolvers } from './resolvers/pets.resolvers';
import { OwnerService } from './services/owner.service';
import { DatabaseModule } from '../database/database.module';
import { OwnersResolvers } from './resolvers/owners.resolvers';

@Module({
  imports: [ DatabaseModule ],
  components: [
    PetsResolvers,
    OwnerService,
    OwnersResolvers,
  ],
})
export class PetsModule {}

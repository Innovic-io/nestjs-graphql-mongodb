import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-client';
import { ObjectID } from 'mongodb';

import { IPet } from '../interfaces/pet.interface';
import { OwnerService } from '../services/owner.service';
import { WRONG_ID_ERROR } from '../common/common.constants';

@Resolver('Pet')
export class PetsResolvers {

  constructor(private readonly ownerService: OwnerService) {}

  @Query()
  async getPetById(request, { _id }) {

    if (!ObjectID.isValid(_id)) {
      throw new ApolloError(WRONG_ID_ERROR);
    }

    const result = await this.ownerService.findByPetId(_id);

    if (!result) {
      return null;
    }

    const [ pet ] = result.pets;

    return pet;
  }
  /**
   * Create new Pet
   *
   * @param request
   * @param {IPet} pet
   * @param context?
   * @param info?
   * @returns {Promise<any>}
   */
  @Mutation()
  async createPet(request, pet: IPet, context?, info?) {

    if (!ObjectID.isValid(pet.owner)) {

      throw new ApolloError(WRONG_ID_ERROR);
    }

    const owner = await this.ownerService.addPet(pet);

    return owner.value;
  }

  /**
   * Update Pet data
   *
   * @param request
   * @param {IPet} pet
   * @param context?
   * @param info?
   * @returns {Promise<Default | undefined>}
   */
  @Mutation()
  async updatePet(request, pet: IPet, context?, info?) {

    if (!ObjectID.isValid(pet._id) || !ObjectID.isValid(pet.owner)) {
      throw new ApolloError(WRONG_ID_ERROR);
    }

    return await this.ownerService.updatePet(pet);
  }

  /**
   * Change Pets Owner
   *
   * @param request
   * @param {any} petID
   * @param {any} owner
   * @param context?
   * @param info?
   * @returns {Promise<any>}
   */
  @Mutation()
  async updatePetsOwner(request, { petID, owner }, context?, info?) {

    if (!ObjectID.isValid(owner) || !ObjectID.isValid(petID)) {

      throw new ApolloError(WRONG_ID_ERROR);
    }

    const newOwner = await this.ownerService.changeOwner(petID, owner);

    return newOwner.value;
  }

  /**
   * remove Pet from Owner
   *
   * @param request
   * @param {any} _id
   * @param context?
   * @param info?
   * @returns {Promise<IPet>}
   */
  @Mutation()
  async deletePet(request, { _id }, context?, info?): Promise<IPet> {

    if (!ObjectID.isValid(_id)) {

      throw new ApolloError(WRONG_ID_ERROR);
    }

    return await this.ownerService.deletePet(_id);
  }

  @ResolveProperty('image')
  async resolveImage({ image }) {

    return await this.ownerService.getPicture(image);
  }
}

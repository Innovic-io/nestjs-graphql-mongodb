import { ObjectID } from 'mongodb';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-client';

import { OwnerService } from '../services/owner.service';
import { PetsGuard } from '../common/common.guard';
import { WRONG_ID_ERROR } from '../common/common.constants';
import { IOwner } from '../interfaces/pet.interface';

@Resolver('Owner')
export class OwnersResolvers {

  constructor(private readonly ownerService: OwnerService) {
  }

  @Query()
  @UseGuards(PetsGuard)
  async getOwners() {

    return await this.ownerService.findAll();
  }

  @Query()
  async getOwnerById(obj, { _id }) {

    if (!ObjectID.isValid(_id)) {

      throw new ApolloError(WRONG_ID_ERROR);
    }

    return await this.ownerService.findOneById(_id);
  }

  /**
   * Create new Owner
   *
   * @param obj
   * @param {IOwner} args
   * @param context?
   * @param info?
   * @returns {Promise<any>}
   */
  @Mutation()
  async createOwner(obj, args: IOwner, context?, info?) {

    return await this.ownerService.create(args);
  }

  /**
   * Update Owner data
   *
   * @param obj
   * @param {IOwner} args
   * @param context?
   * @param info?
   * @returns {Promise<IOwner>}
   */
  @Mutation()
  async updateOwner(obj, args: IOwner, context?, info?) {

    if (!ObjectID.isValid(args._id)) {

      throw new ApolloError(WRONG_ID_ERROR);
    }

    return await this.ownerService.update(args);
  }

  /**
   * Delete Owner from DB
   *
   * @param obj
   * @param {any} _id
   * @param context
   * @param info
   * @returns {Promise<Default | undefined>}
   */
  @Mutation()
  async deleteOwner(obj, { _id }, context?, info?) {

    if (!ObjectID.isValid(_id)) {

      throw new ApolloError(WRONG_ID_ERROR);
    }

    return await this.ownerService.deleteOwner(_id);
  }

  /**
   *    * Uploading pictures
   *
   *  Data places:
   *    - request.files: list of files uploaded
   *    - args.files: list of field names
   * @param request
   * @param {string} fileNames
   * @param context
   * @returns {Promise<void>}
   */
  @Mutation()
  async uploadProfilePicture( request, { fileNames }, context) {
    const [ file ] = request.files.filter((singleFile) => fileNames.indexOf(singleFile.fieldname) >= 0 );

    if (!file) {
      throw new ApolloError({ errorMessage: 'File not found' });
    }

    return await this.ownerService.addPicture(file);
  }

  @Query()
  async getImage(obj, { id }) {

    return await this.ownerService.getPicture(id);
  }

}

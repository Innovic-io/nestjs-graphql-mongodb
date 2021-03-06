import { Component, Inject } from '@nestjs/common';
import { Collection, GridFSBucket } from 'mongodb';

import { IOwner, IPet } from '../interfaces/pet.interface';
import { DATABASE_TOKEN } from '../../database/database.constants';
import { IDatabase } from '../../database/interfaces/database.interface';
import { createObjectID } from './service.helper';
import { FileInterface, ImageInterface } from '../interfaces/file.interface';
import { Readable } from 'stream';

@Component()
// tslint:disable-next-line
export class OwnerService {

  private readonly collectionName = 'owners';
  private readonly collection: Collection;

  constructor(@Inject(DATABASE_TOKEN) private readonly dbService: IDatabase) {

    this.collection = this.dbService.collection(this.collectionName);
  }

  async create(owner) {

    const op = await this.dbService.collection(this.collectionName).insertOne(owner);

    const [addedOwner] = op.ops;

    return addedOwner;
  }

  async update(owner): Promise<IOwner> {

    await this.collection.findOneAndUpdate({ _id: createObjectID(owner._id) }, owner);

    return owner;
  }

  async changeOwner(petID: string, ownerID: string) {

    const oldOwner = await this.findByPetId(petID);

    const [pet] = oldOwner.pets;

    await this.removeFromOwner(oldOwner._id, pet);

    return this.addPetToOwner(ownerID, pet);
  }

  /**
   * Add new Pet to owner
   *
   * @param {IPet} pet
   * @returns {Promise<Promise<FindAndModifyWriteOpResultObject<Default>>>}
   */
  async addPet(pet: IPet) {

    const { owner } = pet;

    delete pet.owner;

    Object.assign(pet, {
      _id: createObjectID(),
    });

    if (pet.dateAdopted) {
      pet = { ...pet, dateAdopted: new Date(pet.dateAdopted) };
    }

    return this.addPetToOwner(owner, pet);
  }

  private async addPetToOwner(owner: string, pet: IPet) {

    return this.collection.findOneAndUpdate({ _id: createObjectID(owner) }, {
      $addToSet: { pets: pet },
    }, { returnOriginal: false });
  }

  private async removeFromOwner(owner: string, pet: IPet) {

    return this.collection.findOneAndUpdate({ _id: createObjectID(owner) }, {
      $pull: { pets: pet },
    });
  }

  async deleteOwner(id: string) {

    const deletedOwner = await this.collection.findOneAndDelete({ _id: createObjectID(id) });

    return deletedOwner.value;
  }

  async findAll(): Promise<IOwner[]> {

    return await this.collection.find({}).toArray();
  }

  async findOneById(id: string): Promise<IOwner> {

    if (id) {
      return this.collection.findOne({ _id: createObjectID(id) });
    }

    return null;
  }

  async findByPetId(petID: string) {

    return await this.collection.findOne({ 'pets._id': createObjectID(petID) },
      {
        projection: {
          '_id': 1,
          'pets.$': 1,
        },
      });
  }

  async deletePet(petId: string) {

    const petOwner = await this.findByPetId(petId);
    if (!petOwner) {
      return null;
    }
    const [ petToRemove ] = petOwner.pets;

    await this.removeFromOwner(petOwner._id, petToRemove);

    return petToRemove;
  }

  async updatePet(pet) {

    const petForUpdate = Object.assign({}, ...Object.keys(pet)
        .filter((oneKey) => oneKey !== '_id')
        .map((oneKey) => {

          const name = `pets.$.${oneKey}`;

          return { [ name ]: pet[ oneKey ] };
        }),
    );

    const result = await this.collection.findOneAndUpdate(
      { 'pets._id': createObjectID(pet._id) },
      {$set : petForUpdate },
      );

    return result.value;
  }

  async addPicture(file: FileInterface) {

    delete file.fieldname;

    const bucket = new GridFSBucket(this.dbService, {
      bucketName: 'avatars',
    });

    const readablePhotoStream = new Readable();
    readablePhotoStream.push(file.buffer);
    readablePhotoStream.push(null);

    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    readablePhotoStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
      return true;
    });
  }

  getPicture(id) {

    if (!id) {
      return null;
    }

    return new Promise((resolve) => {

      const bucket = new GridFSBucket(this.dbService, {
        bucketName: 'avatars',
      });

      const stream = bucket.openDownloadStream(createObjectID(id));

      stream.on('data', (data) => {

        // tslint:disable-next-line
        const file = stream['s'].file;
        const encode = 'base64';

        const imageData: ImageInterface = {
          Buffer: (data as Buffer).toString(encode),
          contentType: file.contentType,
          encoding: encode,
          filename: file.filename,
        };

        resolve(imageData);
      });
    });

  }
}

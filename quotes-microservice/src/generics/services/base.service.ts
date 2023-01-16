import { Injectable, NotFoundException } from "@nestjs/common";
import { Document, FilterQuery, Model, QueryOptions } from "mongoose";
import { Base } from "../db/base.model";

@Injectable()
export class BaseService<Schema extends Base> {
  constructor(protected readonly model: Model<Schema & Document>) { }

  async findOne(id: string, projection: any | null = null): Promise<Schema> {
    const schema: Schema = await this.model
      .findOne({ _id: id }, projection)
      .exec();
    if (!schema) throw new NotFoundException();
    return schema;
  }

  async findOneBy(
    filter: FilterQuery<Schema & Document> = {},
    projection: any | null = null
  ) {
    const schema: Schema = await this.model.findOne(filter, projection).exec();
    if (!schema) throw new NotFoundException();
    return schema;
  }

  async findAll(
    filter: FilterQuery<Schema & Document> = {},
    projection: any | null = null,
    options?:QueryOptions
    // populate: string | object | null = null
  ): Promise<Schema[]> {
    // if (populate !== null) {
    //   return this.model.find(filter, projection).populate(populate).exec();
    // }
    const result = await this.model.find(filter, projection, options).exec();
    return result;
  }

  async create(schema: Schema): Promise<Schema> {
    const createModel = new this.model(schema);
    return createModel.save();
  }

  async update(id: string, schema): Promise<Schema> {
    const newSchema = await this.model.findOneAndUpdate({ _id: id }, schema, {
      new: true
    });
    if (!newSchema) throw new NotFoundException();
    return newSchema;
  }

  async remove(id: string) {
    const deleted = await this.model.deleteOne({ _id: id });
    if (deleted && deleted.deletedCount === 0) throw new NotFoundException();
    return deleted;
  }
}

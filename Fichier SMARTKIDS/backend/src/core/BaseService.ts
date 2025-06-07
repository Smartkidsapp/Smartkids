import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';

export class BaseService<T> {
  constructor(private readonly model: Model<T>) {}

  async findOne(filter: FilterQuery<T>) {
    return this.model.findOne(filter);
  }

  async findMany(filter: FilterQuery<T>) {
    return this.model.find(filter);
  }

  async createOne(data: Partial<T>) {
    return this.model.create(data);
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOneAndUpdate(filter, data, options);
  }

  async updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>) {
    return this.model.updateOne(filter, data);
  }

  async deleteOne(filter: FilterQuery<T>) {
    return this.model.deleteOne(filter);
  }

  async findOneAndDelete(filter: FilterQuery<T>) {
    return this.model.findOneAndDelete(filter);
  }

  async findById(id: string | Types.ObjectId) {
    const _id = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return this.model.findById(_id);
  }

  async countDocuments(filter: FilterQuery<T>) {
    return this.model.countDocuments(filter);
  }

  async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>) {
    return this.model.updateMany(filter, data);
  }
}

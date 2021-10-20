import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link } from './links.model';
import * as shortid from 'shortid';

@Injectable()
export class LinksService {
  constructor(@InjectModel('Link') private readonly linkModel: Model<Link>) {}

  /**
   * Create new link
   *
   *
   * @param link
   */
  async createLink(link: string, username: string) {
    const name = await shortid.generate();
    const newLink = new this.linkModel({
      link,
      name,
      user: username ? username : '',
    });
    await newLink.save();
    return newLink;
  }

  async findURL(link: string) {
    return await this.linkModel.findOne({ name: link });
  }

  async getAllUserLinks(query, limit, skip, order) {
    return await this.linkModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: order });
  }

  async countAllUserLinks(query) {
    return await this.linkModel.find(query).count();
  }

  async getSingleLink(id) {
    return await this.linkModel.findById(id);
  }

  async findUrlByName(name: string) {
    try {
      return await this.linkModel.findOne({
        name,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateUrl(id: string, link: string, name: string) {
    try {
      return await this.linkModel.findByIdAndUpdate(
        id,
        {
          link,
          name,
        },
        { new: true },
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteLink(id: string) {
    try {
      return await this.linkModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async deleteLinksByUsername(username) {
    try {
      return await this.linkModel.deleteMany({
        user: username,
      });
    } catch (err) {
      throw err;
    }
  }
}

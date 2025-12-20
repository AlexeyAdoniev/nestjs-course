import {
  EntitySubscriberInterface,
  DataSource,
  EventSubscriber,
  LoadEvent,
} from 'typeorm';
import { Product } from '../entities/product.entity';
import { StorageService } from '../../../files/storage/storage.service';
import { join } from 'path';
import { BASE_PATH } from '../../../files/util/file.constants';
import { pathExists } from 'fs-extra';

@EventSubscriber()
export class ProductsSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo(): Function | string {
    return Product;
  }

  async afterLoad(entity: Product, event?: LoadEvent<Product>) {
    const imagesFilenames = await this.getImagesFilenames(entity.id);
    entity[this.IMAGES_FILENAMES] = imagesFilenames;
  }

  private readonly IMAGES_FILENAMES = 'imagesFilenames';

  private async getImagesFilenames(id: number) {
    if (!(await pathExists(join(BASE_PATH, id.toString())))) return;

    return this.storageService.getDirFileNames(id.toString());
  }
}

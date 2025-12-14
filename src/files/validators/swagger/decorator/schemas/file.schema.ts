import { ApiFileProperty } from '../api-file-property.decorator';

export class FileSchema {
  @ApiFileProperty()
  file: Express.Multer.File;
}

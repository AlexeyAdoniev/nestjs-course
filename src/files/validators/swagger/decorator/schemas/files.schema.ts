import { ApiFilesProperty } from '../api-files-property.decorator';

export class FilesSchema {
  @ApiFilesProperty()
  file: Express.Multer.File[];
}

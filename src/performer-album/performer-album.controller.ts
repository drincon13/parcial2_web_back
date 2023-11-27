import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerAlbumController {
  constructor(private readonly performerAlbumService: PerformerAlbumService) {}

  @Post(':albumId/performers/:performerId')
  async addPerformerAlbum(
    @Param('albumId') albumId: string,
    @Param('performerId') performerId: string,
  ) {
    return await this.performerAlbumService.addPerformerToAlbum(
      albumId,
      performerId,
    );
  }
}

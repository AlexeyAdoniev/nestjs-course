import { Module } from '@nestjs/common';
import { DocsUnauthorizedMapper } from './docs-unauthorized-mapper/docs-unauthorized-mapper';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  providers: [DocsUnauthorizedMapper],
})
export class DocsModule {}

import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { Setting } from './setting.entity';

import { SettingsResolverBase } from "./setting.resolver.base";
import { SettingService } from "./setting.service";
import { SettingGet } from "./setting.get.entity";

@Resolver(of => SettingGet)
export class SettingsResolver extends SettingsResolverBase {
  constructor(
    public readonly settingService: SettingService,

  ) {
    super(settingService)
  }

}
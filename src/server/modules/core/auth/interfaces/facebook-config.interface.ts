import { ApiModelProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export interface FacebookConfig {
  readonly login_dialog_uri: string;
  readonly access_token_uri: string;
  readonly client_id: string;
  readonly client_secret: string;
  readonly oauth_redirect_uri: string;
  readonly state: string;
}

export class FacebookLogin {
  @ApiModelProperty({ required: true })
  @MinLength(1)
  code: string;
}

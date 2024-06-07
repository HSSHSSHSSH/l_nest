export interface PartialUserInfo {
  id: number;
  username: string;
  isAdmin: boolean;
  roles: string[];
  permissions: string[];
}

export interface UserInfo extends PartialUserInfo {
  nickName: string;

  email: string;

  headPic: string;

  phoneNumber: string;

  isFrozen: boolean;

  createTime: number;
}
export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}

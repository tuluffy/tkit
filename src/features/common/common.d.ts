declare namespace Common {
  interface Authority {
    authority: string;
  }

  interface CurrentUserInfo {
    name: null | string;
    userId: null | string;
    userNo: null | number;
    avatar: null | string;
    email: null | string;
    authorities: IAuthority[];
    enabled?: boolean;
    accountNonExpired?: boolean;
    accountNonLocked?: boolean;
    credentialsNonExpired?: boolean;
  }
}

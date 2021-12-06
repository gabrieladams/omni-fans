
export interface Owner {
  _id:string;
  id: string;
  first_name: string;
  last_name: string;
  description: string;
  address:string;
  password:string;
  nonce:string;
  signature:string;
  ownername:string;
  email:string;
  confirmPassword:string;
  company:string;
  website:string;
  state:string;
  city:string;
  profile_photos:string[]
}

export interface OwnerLoginResponse{
  owner:Owner,
  token:string,
  success:boolean
  message:string;
}

export interface OwnerLoginObject{
  identifier:string,
  password:string
}

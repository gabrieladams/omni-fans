
export interface Collectible {
  _id:string;
  id: number;
  price:number;
  putOnMarketPlace:boolean;
  unlockOncePurchased:boolean;
  priceType:string;
  title:string;
  royalties:number;
  extraProperties:{name:string,value:string}[];
  description:string;
  owner:string;
  
  profile_photos:string[]
}

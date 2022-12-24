declare type Objectish = AnyObject | AnyArray | AnyMap | AnySet;
declare type AnyObject = {
  [key: string]: any;
};
declare type AnyArray = Array<any>;
declare type AnySet = Set<any>;
declare type AnyMap = Map<any, any>;
